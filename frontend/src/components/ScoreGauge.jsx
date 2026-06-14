export default function ScoreGauge({ score = 0, label = "risk" }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const tone = score >= 70 ? "danger" : score >= 30 ? "warning" : "safe";

  return (
    <div className={`score-chart ${tone}`}>
      <svg viewBox="0 0 120 120" aria-label={`${label} score ${score}`}>
        <circle className="score-track" cx="60" cy="60" r={radius} />
        <circle
          className="score-value"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div>
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
