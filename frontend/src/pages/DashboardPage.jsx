import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../components/ui';
import { getAnalytics } from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState({
    total: 0,
    phishingPercent: 0,
    distribution: [],
    daily: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getAnalytics();
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Scans', value: data.total, icon: Activity, trend: '+12%', trendUp: true },
    { label: 'Detection Rate', value: `${data.phishingPercent}%`, icon: ShieldAlert, trend: '+5%', trendUp: true },
    { label: 'Active Analysts', value: '1,284', icon: Users, trend: '-2%', trendUp: false },
    { label: 'Avg. Scan Time', value: '0.4s', icon: TrendingUp, trend: 'Fast', trendUp: true },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Security Dashboard</h1>
        <p className="text-slate-400 mt-1">Global threat intelligence and system performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-8 md:p-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <stat.icon size={20} className="text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-success' : 'text-danger'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-10 md:p-12">
          <h3 className="text-lg font-bold text-white mb-8">Daily Activity Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={data.daily.length > 0 ? data.daily : [
                {date: '05-01', scans: 40},
                {date: '05-02', scans: 55},
                {date: '05-03', scans: 48},
                {date: '05-04', scans: 70},
                {date: '05-05', scans: 62},
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                  itemStyle={{color: '#fff'}}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="scans" radius={[6, 6, 0, 0]}>
                  {data.daily.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#2563eb'} />
                  ))}
                  {/* Fallback fill if daily is empty */}
                  {!data.daily.length && <Cell fill="#3b82f6" />}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-1 p-10 md:p-12">
          <h3 className="text-lg font-bold text-white mb-8">Threat Distribution</h3>
          <div className="flex flex-col gap-6">
            {data.distribution.length > 0 ? data.distribution.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.name === 'Phishing' ? 'bg-danger' : item.name === 'Suspicious' ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${(item.value / data.total) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 italic text-sm">
                No scan data available.
              </div>
            )}
            <div className="mt-4 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 leading-relaxed">
                Distribution is calculated based on the last 500 scans processed by the AI engine.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
