import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { Award, Zap, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

export default function AnalyticsTab() {
  const [history, setHistory] = useState([]);
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    try {
      const historicalMetrics = JSON.parse(localStorage.getItem('app_metrics') || '[]');
      const historicalMistakes = JSON.parse(localStorage.getItem('app_mistakes') || '[]');
      
      setHistory(historicalMetrics);
      setMistakes(historicalMistakes);
    } catch(e) {}
  }, []);

  // Calculate Rolling Averages (latest 5 sessions)
  const latestSessions = history.slice(-5);
  const getAverage = (key) => {
    if (latestSessions.length === 0) return 0;
    const sum = latestSessions.reduce((acc, curr) => acc + (curr.metrics?.[key] || 0), 0);
    return Math.round(sum / latestSessions.length);
  };

  const currentFluency = getAverage('fluency');
  const currentGrammar = getAverage('grammar');
  const currentVocab = getAverage('vocabulary');

  // Aggregated Mistake Categories
  const mistakeCounts = mistakes.reduce((acc, curr) => {
    const title = curr.title || 'Other';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const sortedMistakes = Object.entries(mistakeCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const chartData = history.slice(-10).map((h, i) => ({
    name: `S${i+1}`,
    score: Math.round(((h.metrics?.fluency || 0) + (h.metrics?.grammar || 0) + (h.metrics?.vocabulary || 0)) / 3)
  }));

  return (
    <div className="flex-col">
      <h1 className="text-h1">Analytics</h1>
      <p className="text-sub">Tracking your speaking progress</p>

      {/* Hero Stats */}
      <div className="card grid-2" style={{ backgroundColor: 'var(--primary-dark)', color: 'white', marginBottom: '32px' }}>
         <div className="flex-col items-center">
            <Award size={24} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Current Rank</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Rookie Learner</div>
         </div>
         <div className="flex-col items-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <Zap size={24} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Days Streak</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>1 Day</div>
         </div>
      </div>

      {/* Performance Rings */}
      <div className="text-h2">Performance</div>
      <div className="grid-2" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <div className="ring-container">
          <div className="ring" style={{'--percentage': currentFluency}}>{currentFluency}%</div>
          <div className="ring-label">Fluency</div>
        </div>
        <div className="ring-container">
          <div className="ring" style={{'--percentage': currentGrammar}}>{currentGrammar}%</div>
          <div className="ring-label">Grammar</div>
        </div>
        <div className="ring-container">
          <div className="ring" style={{'--percentage': currentVocab}}>{currentVocab}%</div>
          <div className="ring-label">Vocab</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="text-h2">Improvement Tracking</div>
      <div className="card" style={{ height: '220px', padding: '20px 10px', marginBottom: '32px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'var(--primary-dark)' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mistake Tracker */}
      <div className="text-h2">Top Repeated Mistakes</div>
      <div className="card">
        {sortedMistakes.length > 0 ? sortedMistakes.map((m, i) => (
          <div key={i} className="mistake-item">
            <div className="mistake-rank" style={{ backgroundColor: i < 3 ? 'var(--primary-light)' : 'var(--bg-app)', color: i < 3 ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
              #{i+1}
            </div>
            <div className="mistake-content">
              <div className="mistake-title">{m.title}</div>
              <div className="mistake-desc">You made this mistake {m.count} times.</div>
            </div>
            <div className="mistake-count">x{m.count}</div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No mistakes recorded yet. Keep speaking!
          </div>
        )}
      </div>
      
      <div style={{ height: '40px' }}></div>
    </div>
  );
}
