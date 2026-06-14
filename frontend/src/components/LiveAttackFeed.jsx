export default function LiveAttackFeed({ items = [] }) {
  return (
    <article className="glass live-feed">
      <p className="eyebrow">Live attack feed</p>
      <h3>Recent phishing detections</h3>
      <div>
        {items.length ? (
          items.map((item) => (
            <div className="feed-item" key={item._id}>
              <strong>{item.type || "scan"} · {item.score}</strong>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
              <p>{item.input}</p>
            </div>
          ))
        ) : (
          <p className="muted">No phishing detections yet.</p>
        )}
      </div>
    </article>
  );
}
