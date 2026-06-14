export default function ThreatBreakdown({ breakdown = [] }) {
  return (
    <div className="breakdown-list">
      {breakdown.map((item) => (
        <div className="breakdown-row" key={item.key}>
          <div>
            <span>{item.label}</span>
            <strong>{item.score}</strong>
          </div>
          <div className="bar-track">
            <div className={item.score >= 70 ? "danger" : item.score >= 30 ? "warning" : "safe"} style={{ width: `${Math.min(item.score, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
