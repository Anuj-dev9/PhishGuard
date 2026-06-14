import { useEffect, useMemo, useState } from "react";
import { scanContent } from "../services/api";
import ExplainableText from "./ExplainableText";
import ScoreGauge from "./ScoreGauge";
import ThreatBreakdown from "./ThreatBreakdown";
import UrlAnalysisCard from "./UrlAnalysisCard";

const scanModes = {
  email: {
    label: "Email",
    kicker: "Mailbox threat",
    title: "Email scan",
    placeholder: "Paste subject, sender, and email body...",
    inputLabel: "Email content",
    metric: "Headers, tone, credential pressure",
    samples: [
      "Subject: Urgent account alert\nFrom: security@bank-support-alert.com\nVerify your bank password now or your account will be suspended.",
      "Subject: Invoice ready\nFrom: billing@github.com\nYour GitHub invoice is ready for review in your account.",
    ],
  },
  link: {
    label: "Link",
    kicker: "URL reputation",
    title: "Link scan",
    placeholder: "Paste a URL or domain...",
    inputLabel: "Link or domain",
    metric: "Lookalikes, TLDs, redirects",
    samples: ["http://paypa1-login.xyz/verify payment failed update card", "https://github.com/security"],
  },
  number: {
    label: "Number",
    kicker: "SMS and calls",
    title: "Number scan",
    placeholder: "Paste a phone number, caller note, or SMS...",
    inputLabel: "Phone or SMS content",
    metric: "OTP pressure, callback traps",
    samples: ["SMS from bank: call +1 888 555 0199 now to unlock your account and verify OTP", "+1 415 555 0134 called about tomorrow's delivery appointment"],
  },
};

const emptyAnalysis = {
  result: "Ready",
  severity: "None",
  score: 0,
  confidence: 0,
  mlProbability: 0,
  signals: [],
  wordSignals: [],
  breakdown: [
    { key: "urgency", label: "Urgency", score: 0 },
    { key: "credential", label: "Credential request", score: 0 },
    { key: "financial", label: "Financial terms", score: 0 },
    { key: "domain", label: "Suspicious domain", score: 0 },
  ],
  urls: [],
  urlAnalysis: [],
  recommendation: "Choose a scan type and submit content.",
  model: { name: "Local TF-IDF Logistic Regression", trainingSamples: 333, features: "word n-grams, character n-grams, phishing heuristics" },
};

export default function Scanner({ onScanComplete }) {
  const [mode, setMode] = useState("email");
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(emptyAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeMode = scanModes[mode];

  const statusClass = useMemo(() => {
    const value = analysis.result.toLowerCase();
    if (value === "phishing") return "danger";
    if (value === "suspicious") return "warning";
    if (value === "safe") return "safe";
    return "idle";
  }, [analysis.result]);

  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed.length < 4) {
      setAnalysis(emptyAnalysis);
      setError("");
      return undefined;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const result = await scanContent({ text: trimmed, type: mode });
        setAnalysis(result);
        onScanComplete?.();
      } catch (err) {
        setError(err.response?.data?.error || "Network error. Scan could not be completed.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [text, mode, onScanComplete]);

  return (
    <>
      <section className="summary-strip" aria-label="Security summary">
        <article><span>Risk score</span><strong>{analysis.score}</strong></article>
        <article><span>Confidence</span><strong>{analysis.confidence || 0}%</strong></article>
        <article><span>Signals</span><strong>{analysis.signals?.length || 0}</strong></article>
        <article><span>URLs</span><strong>{analysis.urls?.length || 0}</strong></article>
      </section>

      <section className="dashboard" id="scanner">
        <nav className="scan-rail" aria-label="Scan sections">
          {Object.entries(scanModes).map(([key, item]) => (
            <button className={mode === key ? "scan-card active" : "scan-card"} key={key} onClick={() => { setMode(key); setText(""); setAnalysis(emptyAnalysis); }} type="button">
              <span>{item.label}</span><strong>{item.kicker}</strong><small>{item.metric}</small>
            </button>
          ))}
        </nav>

        <section className="input-console glass">
          <div className="section-head">
            <div><p className="eyebrow">{activeMode.kicker}</p><h2>{activeMode.title}</h2></div>
            {loading && <span className="scan-loader">Scanning</span>}
          </div>
          <textarea className="w-full min-h-[290px] my-4 p-5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y leading-relaxed" aria-label={activeMode.inputLabel} onChange={(event) => setText(event.target.value)} placeholder={activeMode.placeholder} spellCheck="false" value={text} />
          {error && <p className="error-text">{error}</p>}
          <div className="console-actions">
            <div className="sample-actions">
              {activeMode.samples.map((sample, index) => <button key={sample} onClick={() => setText(sample)} type="button">Sample {index + 1}</button>)}
            </div>
          </div>
          <ExplainableText text={text} wordSignals={analysis.wordSignals} />
        </section>

        <aside className={`risk-panel glass ${statusClass}`}>
          <ScoreGauge score={analysis.score} />
          <p className="eyebrow">Assessment</p>
          <h2>{analysis.result}</h2>
          <p className="recommendation">{analysis.recommendation}</p>
          <ThreatBreakdown breakdown={analysis.breakdown} />
        </aside>
      </section>

      <section className="intel-grid">
        <article className="glass">
          <p className="eyebrow">Detected signals</p>
          <div className="signal-list">{analysis.signals?.length ? analysis.signals.map((signal) => <span key={signal}>{signal}</span>) : <p>No signals detected yet.</p>}</div>
        </article>
        <UrlAnalysisCard items={analysis.urlAnalysis} />
        <article className="glass" id="model"><p className="eyebrow">Model</p><h3>{analysis.model?.trainingSamples || 0} samples</h3><p>{analysis.model?.features}</p></article>
      </section>
    </>
  );
}
