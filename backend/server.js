const crypto = require("crypto");
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Log = require("./models/Log");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/phishingDB";
const FLASK_API_URL = process.env.FLASK_API_URL || "http://127.0.0.1:5000";
const JWT_SECRET = process.env.JWT_SECRET || "dev-phishguard-secret-change-me";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt] = storedHash.split(":");
  return hashPassword(password, salt) === storedHash;
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

function fallbackAnalysis(text) {
  const rules = [
    ["Urgent language", /\b(urgent|now|immediately|24 hours|final notice|expires)\b/i, 18],
    ["Credential request", /\b(password|login|verify|otp|pin|seed phrase|auth code)\b/i, 22],
    ["Financial terms", /\b(bank|payment|card|billing|invoice|refund|wallet|crypto)\b/i, 18],
    ["Suspicious domain", /\b(\.ru|\.xyz|\.top|paypa1|login-|verify-)\b/i, 24],
  ];
  const signals = [];
  const breakdown = [
    { key: "urgency", label: "Urgency", score: 0 },
    { key: "credential", label: "Credential request", score: 0 },
    { key: "financial", label: "Financial terms", score: 0 },
    { key: "domain", label: "Suspicious domain", score: 0 },
  ];

  rules.forEach(([label, pattern, weight], index) => {
    if (pattern.test(text)) {
      signals.push(label);
      breakdown[Math.min(index, 3)].score += weight;
    }
  });

  const score = Math.min(100, breakdown.reduce((sum, item) => sum + item.score, 0));
  const result = score >= 70 ? "Phishing" : score >= 35 ? "Suspicious" : "Safe";
  return {
    result,
    severity: score >= 70 ? "High" : score >= 35 ? "Medium" : "Low",
    score,
    confidence: Math.abs(score - 50) * 2,
    mlProbability: score,
    signals,
    wordSignals: [],
    breakdown,
    urls: [],
    urlAnalysis: [],
    recommendation: "Fallback scanner used because the ML service is unavailable.",
    model: { name: "Node fallback rules", trainingSamples: 0, features: "regex heuristics" },
    fallback: true,
  };
}

async function ensureSeedUsers() {
  const count = await User.countDocuments();
  if (count > 0) return;
  await User.create([
    {
      name: "Admin Analyst",
      email: "admin@phishguard.ai",
      passwordHash: hashPassword("admin123"),
      role: "admin",
    },
    {
      name: "Security User",
      email: "user@phishguard.ai",
      passwordHash: hashPassword("user123"),
      role: "user",
    },
  ]);
  console.log("Seeded demo users");
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await ensureSeedUsers();
  })
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "offline",
    flaskApi: FLASK_API_URL,
  });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const user = await User.create({
    name,
    email,
    role: "user",
    passwordHash: hashPassword(password),
  });
  res.status(201).json({
    token: signToken(user),
    user: { email: user.email, name: user.name, role: user.role },
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
  if (!user || !verifyPassword(password || "", user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({
    token: signToken(user),
    user: { email: user.email, name: user.name, role: user.role },
  });
});

app.get("/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    // Return success anyway to prevent email enumeration
    return res.json({ message: "If an account exists, a reset link was generated." });
  }

  const resetToken = jwt.sign(
    { sub: user._id.toString(), purpose: "reset_password" },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  // In a real application, you would send the resetToken via email here.
  // We just return a success message so as to not leak whether the email exists.
  res.json({ 
    message: "If an account exists, a reset link was generated."
  });
});

app.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "reset_password") {
      return res.status(400).json({ error: "Invalid token purpose" });
    }

    const user = await User.findById(decoded.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.passwordHash = hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired reset token" });
  }
});

app.post("/check", requireAuth, async (req, res) => {
  const { text, type = "email" } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  let analysis;
  try {
    const response = await axios.post(`${FLASK_API_URL}/predict`, { text }, { timeout: 3500 });
    analysis = response.data;
  } catch {
    analysis = fallbackAnalysis(text);
  }

  if (mongoose.connection.readyState === 1) {
    await Log.create({
      input: text,
      type,
      result: analysis.result,
      severity: analysis.severity,
      score: analysis.score,
      signals: analysis.signals,
      urlAnalysis: analysis.urlAnalysis,
      userEmail: req.user.email,
    });
  }

  res.json(analysis);
});

app.get("/logs", requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
  res.json(logs);
});

app.get("/analytics", requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ total: 0, phishingPercent: 0, distribution: [], daily: [] });
  }
  const logs = await Log.find().sort({ createdAt: -1 }).limit(500);
  const total = logs.length;
  const counts = logs.reduce((acc, log) => {
    acc[log.result] = (acc[log.result] || 0) + 1;
    return acc;
  }, {});
  const dailyMap = logs.reduce((acc, log) => {
    const day = log.createdAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  res.json({
    total,
    phishingPercent: total ? Math.round(((counts.Phishing || 0) / total) * 100) : 0,
    distribution: ["Safe", "Suspicious", "Phishing"].map((name) => ({ name, value: counts[name] || 0 })),
    daily: Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, scans]) => ({ date, scans })),
  });
});

app.get("/attack-feed", requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const logs = await Log.find({ result: "Phishing" }).sort({ createdAt: -1 }).limit(10);
  res.json(logs);
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
