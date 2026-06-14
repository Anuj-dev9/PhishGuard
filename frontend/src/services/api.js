import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("phishguardSession");
  if (stored) {
    const session = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, newPassword) {
  const { data } = await api.post("/auth/reset-password", { token, newPassword });
  return data;
}

export async function scanContent(payload) {
  const { data } = await api.post("/check", payload);
  return data;
}

export async function getLogs() {
  const { data } = await api.get("/logs");
  return data;
}

export async function getAnalytics() {
  const { data } = await api.get("/analytics");
  return data;
}

export async function getAttackFeed() {
  const { data } = await api.get("/attack-feed");
  return data;
}

export default api;
