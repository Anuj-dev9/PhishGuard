export default function ExplainableText({ text, wordSignals = [] }) {
  if (!text) return <p className="muted">Analyzed text will appear here with highlighted risk terms.</p>;
  if (!wordSignals.length) return <p className="explain-text">{text}</p>;

  const sorted = [...wordSignals].sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;

  sorted.forEach((signal, index) => {
    if (signal.start < cursor) return;
    if (signal.start > cursor) {
      parts.push(<span key={`plain-${index}`}>{text.slice(cursor, signal.start)}</span>);
    }
    parts.push(
      <mark className={`flagged ${signal.factor}`} key={`signal-${index}`} title={`${signal.label} +${signal.weight}`}>
        {text.slice(signal.start, signal.end)}
        <span>{`+${signal.weight}`}</span>
      </mark>
    );
    cursor = signal.end;
  });

  if (cursor < text.length) parts.push(<span key="tail">{text.slice(cursor)}</span>);
  return <p className="explain-text">{parts}</p>;
}
