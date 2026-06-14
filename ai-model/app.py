import difflib
import re
from urllib.parse import urlparse

from flask import Flask, jsonify, request
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import FeatureUnion, Pipeline

    HAS_SKLEARN = True
except ModuleNotFoundError:
    HAS_SKLEARN = False

app = Flask(__name__)

BRANDS = ["bank", "paypal", "microsoft", "google", "amazon", "apple", "netflix", "instagram", "facebook", "coinbase"]
SUSPICIOUS_TLDS = (".ru", ".xyz", ".top", ".info", ".zip", ".click")
SAFE_DOMAINS = ["google.com", "paypal.com", "microsoft.com", "amazon.com", "github.com", "irs.gov"]
SUSPICIOUS_DOMAINS = ["paypa1-login.com", "secure-bank-verify.ru", "microsoft-support-reset.info", "free-gift-claim.xyz"]

RULES = [
    {"factor": "urgency", "label": "Urgent language", "pattern": r"\b(urgent|immediately|now|24 hours|today|final notice|limited time|expires)\b", "weight": 16},
    {"factor": "credential", "label": "Credential request", "pattern": r"\b(password|login|sign in|verify|confirm|seed phrase|otp|2fa|pin|auth code)\b", "weight": 18},
    {"factor": "financial", "label": "Financial terms", "pattern": r"\b(bank|billing|payment|card|wire transfer|refund|invoice|wallet|crypto|fee)\b", "weight": 15},
    {"factor": "domain", "label": "Threat or suspension", "pattern": r"\b(suspended|closed|deactivated|blocked|failed|held|overdue|unlock)\b", "weight": 12},
    {"factor": "urgency", "label": "Prize or giveaway", "pattern": r"\b(winner|prize|gift|bonus|claim)\b", "weight": 10},
    {"factor": "credential", "label": "Suspicious attachment", "pattern": r"\b(attachment|enable macros|download file)\b", "weight": 10},
    {"factor": "domain", "label": "Shortened URL", "pattern": r"\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|rebrand\.ly)\b", "weight": 12},
    {"factor": "credential", "label": "OTP request", "pattern": r"\b(otp|verification code|auth code|one time code|reply with code)\b", "weight": 18},
    {"factor": "urgency", "label": "Callback pressure", "pattern": r"\b(call|text|sms|whatsapp|telegram)\b.*\b(now|urgent|unlock|verify|payment)\b", "weight": 12},
]

FACTOR_LABELS = {
    "urgency": "Urgency",
    "credential": "Credential request",
    "financial": "Financial terms",
    "domain": "Suspicious domain",
}


def build_dataset():
    phishing_templates = [
        "urgent verify your {brand} password now",
        "{brand} account suspended click this link to restore access",
        "confirm your billing details for {brand} within 24 hours",
        "security alert unusual login detected update your password",
        "payment failed update card information immediately",
        "claim your refund by entering bank details",
        "winner prize selected submit your personal information",
        "reset your {brand} wallet seed phrase",
        "invoice overdue open attachment and enable macros",
        "verify identity or your account will be closed",
        "login at {domain} to avoid permanent deactivation",
        "sms from {brand}: call +1 888 555 0199 to unlock your account",
        "text message says your {brand} otp expires now reply with code",
    ]
    safe_templates = [
        "{brand} monthly statement is ready in your account",
        "team meeting moved to Thursday afternoon",
        "your order shipped and tracking is available",
        "password changed successfully from your account settings",
        "newsletter security tips for safer browsing",
        "receipt for your recent purchase",
        "calendar invitation for project planning",
        "support ticket update with no action required",
        "your subscription renewal confirmation",
        "github.com security documentation",
    ]

    texts, labels = [], []
    for brand in BRANDS:
        for template in phishing_templates:
            texts.append(template.format(brand=brand, domain=f"{brand}-secure-login.com"))
            labels.append(1)
        for template in safe_templates:
            texts.append(template.format(brand=brand))
            labels.append(0)
    for domain in SUSPICIOUS_DOMAINS:
        texts.extend([f"https://{domain}/verify", f"login now at {domain}", f"{domain} password reset required"])
        labels.extend([1, 1, 1])
    for domain in SAFE_DOMAINS:
        texts.extend([domain, f"https://{domain}/account", f"visit {domain} for support"])
        labels.extend([0, 0, 0])
    return texts, labels


def make_model():
    if not HAS_SKLEARN:
        class HeuristicModel:
            def fit(self, _texts, _labels):
                return self

            def predict_proba(self, values):
                rows = []
                for value in values:
                    signal_labels, _word_signals, breakdown, _urls, url_analysis = explainable_signals(value)
                    heuristic_score = sum(item["score"] for item in breakdown)
                    url_score = sum(item["score"] for item in url_analysis)
                    context_penalty = 6 if len(value) < 8 else 0
                    probability = min(0.98, max(0.02, (heuristic_score + url_score + context_penalty) / 100))
                    if not signal_labels and len(value) >= 8:
                        probability = min(probability, 0.22)
                    rows.append([1 - probability, probability])
                return rows

        return HeuristicModel()

    return Pipeline(
        [
            (
                "features",
                FeatureUnion(
                    [
                        ("word", TfidfVectorizer(analyzer="word", ngram_range=(1, 3), lowercase=True)),
                        ("char", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), lowercase=True)),
                    ]
                ),
            ),
            ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced")),
        ]
    )


texts, labels = build_dataset()
model = make_model()
model.fit(texts, labels)


def normalize_text(value):
    return re.sub(r"\s+", " ", value or "").strip()


def extract_urls(text):
    return re.findall(r"(https?://[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,})", text, flags=re.I)


def analyze_domain(raw_url):
    with_scheme = raw_url if raw_url.startswith(("http://", "https://")) else f"http://{raw_url}"
    parsed = urlparse(with_scheme)
    domain = (parsed.netloc or parsed.path).lower().strip("/")
    reasons = []
    score = 0

    if not raw_url.startswith("https://"):
        reasons.append("Missing HTTPS")
        score += 18
    if domain.endswith(SUSPICIOUS_TLDS):
        reasons.append("Suspicious TLD")
        score += 22
    if re.search(r"\d", domain):
        reasons.append("Numbers inside domain")
        score += 12
    if domain.count("-") >= 2:
        reasons.append("Multiple hyphens")
        score += 10

    root = domain.split(":")[0].replace("www.", "")
    second_level = root.split(".")[0]
    for brand in BRANDS:
        ratio = difflib.SequenceMatcher(None, second_level, brand).ratio()
        if brand in second_level and root != f"{brand}.com":
            reasons.append(f"Brand-like domain referencing {brand}")
            score += 20
            break
        if ratio >= 0.72 and second_level != brand:
            reasons.append(f"Possible typosquatting of {brand}")
            score += 24
            break

    if score >= 55:
        risk = "High"
    elif score >= 25:
        risk = "Medium"
    else:
        risk = "Low"

    return {"domain": domain, "riskLevel": risk, "score": min(score, 100), "reasons": reasons}


def tokenize(text):
    return list(re.finditer(r"\b[\w.-]+\b", text))


def explainable_signals(text):
    word_signals = []
    factor_scores = {key: 0 for key in FACTOR_LABELS}
    signal_labels = []

    for rule in RULES:
        pattern = re.compile(rule["pattern"], re.I)
        if pattern.search(text):
            signal_labels.append(rule["label"])
            factor_scores[rule["factor"]] += rule["weight"]
            for match in pattern.finditer(text):
                word_signals.append(
                    {
                        "word": match.group(0),
                        "start": match.start(),
                        "end": match.end(),
                        "label": rule["label"],
                        "factor": rule["factor"],
                        "weight": rule["weight"],
                    }
                )

    urls = extract_urls(text)
    url_analysis = [analyze_domain(url) for url in urls]
    for item in url_analysis:
        if item["reasons"]:
            signal_labels.extend(item["reasons"])
            factor_scores["domain"] += min(item["score"], 35)
            for token in tokenize(text):
                if item["domain"].replace("www.", "") in token.group(0).lower():
                    word_signals.append(
                        {
                            "word": token.group(0),
                            "start": token.start(),
                            "end": token.end(),
                            "label": ", ".join(item["reasons"]),
                            "factor": "domain",
                            "weight": min(item["score"], 35),
                        }
                    )

    breakdown = [
        {"key": key, "label": label, "score": min(score, 100)}
        for key, label in FACTOR_LABELS.items()
        for score in [factor_scores[key]]
    ]
    return signal_labels, word_signals, breakdown, urls, url_analysis


def analyze_text(text):
    probability = float(model.predict_proba([text])[0][1])
    ml_score = round(probability * 100)
    signal_labels, word_signals, breakdown, urls, url_analysis = explainable_signals(text)
    heuristic_score = sum(item["score"] for item in breakdown)

    if len(text) < 8:
        signal_labels.append("Too little context")
        heuristic_score += 6

    final_score = min(100, round((ml_score * 0.62) + (heuristic_score * 0.38)))
    if final_score >= 70:
        result, severity = "Phishing", "High"
        recommendation = "Do not click links or provide credentials. Verify through the official site or support channel."
    elif final_score >= 45:
        result, severity = "Suspicious", "Medium"
        recommendation = "Treat with caution. Check sender identity, domains, and request context before acting."
    else:
        result, severity = "Safe", "Low"
        recommendation = "No major phishing signals were detected. Still verify unexpected requests before sharing data."

    return {
        "result": result,
        "severity": severity,
        "score": final_score,
        "confidence": abs(final_score - 50) * 2,
        "mlProbability": ml_score,
        "signals": sorted(set(signal_labels))[:12],
        "wordSignals": word_signals[:30],
        "breakdown": breakdown,
        "urls": urls,
        "urlAnalysis": url_analysis,
        "recommendation": recommendation,
        "model": {
            "name": "Local TF-IDF Logistic Regression" if HAS_SKLEARN else "Local Heuristic Phishing Classifier",
            "trainingSamples": len(texts),
            "features": (
                "word n-grams, character n-grams, phishing heuristics, URL intelligence"
                if HAS_SKLEARN
                else "phishing heuristics, URL intelligence"
            ),
        },
    }


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "trainingSamples": len(texts)})


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    text = normalize_text(payload.get("text", ""))
    if not text:
        return jsonify({"error": "Text is required"}), 400
    return jsonify(analyze_text(text))


if __name__ == "__main__":
    app.run(port=5000)
