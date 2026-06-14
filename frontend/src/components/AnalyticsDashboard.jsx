import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = {
  Safe: "#16a34a",
  Suspicious: "#eab308",
  Phishing: "#ef4444",
};

export default function AnalyticsDashboard({ analytics, loading }) {
  if (loading) {
    return <section className="analytics-grid skeleton"><article /><article /><article /></section>;
  }

  return (
    <section className="analytics-grid">
      <article className="glass">
        <p className="eyebrow">Total scans</p>
        <h3>{analytics.total || 0}</h3>
        <p>{analytics.phishingPercent || 0}% phishing detection rate</p>
      </article>
      <article className="glass chart-card">
        <p className="eyebrow">Distribution</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={analytics.distribution || []} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>
              {(analytics.distribution || []).map((entry) => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </article>
      <article className="glass chart-card">
        <p className="eyebrow">Daily scans</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analytics.daily || []}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="scans" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
