export default function UrlAnalysisCard({ items = [] }) {
  return (
    <article className="glass">
      <p className="eyebrow">URL deep analysis</p>
      <h3>{items.length} inspected</h3>
      <div className="url-list">
        {items.length ? (
          items.map((item) => (
            <div className="url-item" key={item.domain}>
              <div>
                <strong>{item.domain}</strong>
                <span className={`badge ${item.riskLevel.toLowerCase()}`}>{item.riskLevel}</span>
              </div>
              <p>{item.reasons.length ? item.reasons.join(", ") : "No major URL issues detected."}</p>
            </div>
          ))
        ) : (
          <p className="muted">No URLs found in the current scan.</p>
        )}
      </div>
    </article>
  );
}
