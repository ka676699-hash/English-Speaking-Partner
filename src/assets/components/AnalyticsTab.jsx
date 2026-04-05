import { useState, useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis } from 'recharts';

export default function AnalyticsTab() {
  const [activeSegment, setActiveSegment] = useState('7days');
  const [metrics, setMetrics] = useState({
    fluency: 75,
    vocabulary: 68,
    grammar: 82,
    pronunciation: 70
  });
  const [chartData, setChartData] = useState([
    { name: 'Week 1', value: 20 },
    { name: 'Week 2', value: 45 },
    { name: 'Week 3', value: 55 },
    { name: 'Today', value: 85 },
  ]);
  const [topMistakes, setTopMistakes] = useState([]);
  const [trend, setTrend] = useState('+12%');

  useEffect(() => {
    // 1. Process Metrics
    try {
      const historicalMetrics = JSON.parse(localStorage.getItem('app_metrics') || '[]');
      if (historicalMetrics.length > 0) {
        let fSum = 0, vSum = 0, gSum = 0, pSum = 0;
        historicalMetrics.forEach(item => {
          fSum += item.metrics?.fluency || 75;
          vSum += item.metrics?.vocabulary || 70;
          gSum += item.metrics?.grammar || 75;
          pSum += item.metrics?.pronunciation || 75;
        });
        const len = historicalMetrics.length;
        setMetrics({
          fluency: Math.round(fSum / len),
          vocabulary: Math.round(vSum / len),
          grammar: Math.round(gSum / len),
          pronunciation: Math.round(pSum / len),
        });

        // Chart processing (track overall rolling average)
        const mappedChart = historicalMetrics.slice(-5).map((r, i) => {
           const avg = ((r.metrics?.fluency || 70) + (r.metrics?.grammar || 70) + (r.metrics?.vocabulary || 70)) / 3;
           return {
             name: `Talk ${i + 1}`,
             value: Math.round(avg)
           };
        });
        
        if (mappedChart.length >= 2) {
           setChartData(mappedChart);
           // Calculate dynamic trend
           const firstVal = mappedChart[0].value;
           const lastVal = mappedChart[mappedChart.length-1].value;
           const diff = lastVal - firstVal;
           setTrend(diff >= 0 ? `+${diff}%` : `${diff}%`);
        } else if (mappedChart.length === 1) {
           setChartData([ { name: 'Start', value: 50 }, mappedChart[0] ]);
           const diff = mappedChart[0].value - 50;
           setTrend(diff >= 0 ? `+${diff}%` : `${diff}%`);
        }
      }
    } catch(e) {}

    // 2. Process Mistakes
    try {
      const allMistakes = JSON.parse(localStorage.getItem('app_mistakes') || '[]');
      if (allMistakes.length > 0) {
        const counts = {};
        const descs = {};
        allMistakes.forEach(m => {
          counts[m.title] = (counts[m.title] || 0) + 1;
          descs[m.title] = m.desc; // Keep most recent description for that type
        });

        const sorted = Object.entries(counts)
          .sort((a,b) => b[1] - a[1])
          .slice(0, 5)
          .map(([title, count]) => ({
             title,
             count,
             desc: descs[title]
          }));

        setTopMistakes(sorted);
      } else {
        // Fallback default mistakes for UI if none exist yet
        setTopMistakes([
          { title: "Missing 'a'/'the' articles", desc: "Tip: Use articles before countable singular nouns.", count: 12 },
          { title: "Subject-Verb Agreement", desc: "Tip: Remember the 's' for third-person singular verbs.", count: 8 },
          { title: "Preposition 'in' vs 'at'", desc: "Tip: Use 'at' for specific times or points.", count: 5 }
        ]);
      }
    } catch(e) {}

  }, []);

  const getRankColors = (index) => {
    const palletes = [
      { bg: '#fee2e2', text: '#b91c1c' }, // Red
      { bg: '#ffedd5', text: '#c2410c' }, // Orange
      { bg: '#fef3c7', text: '#b45309' }, // Amber
      { bg: '#e0e7ff', text: '#4338ca' }, // Indigo
      { bg: '#f3e8ff', text: '#7e22ce' }, // Purple
    ];
    return palletes[index] || palletes[0];
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="text-h1">Performance Analytics</div>
      <div className="text-sub">Tracking your journey to mastery</div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeSegment === '7days' ? 'active' : ''}`}
          onClick={() => setActiveSegment('7days')}
        >
          Last 7 days
        </button>
        <button 
          className={`tab-btn ${activeSegment === '30days' ? 'active' : ''}`}
          onClick={() => setActiveSegment('30days')}
        >
          Last 30 days
        </button>
        <button 
          className={`tab-btn ${activeSegment === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveSegment('custom')}
        >
          Custom
        </button>
      </div>

      <div className="card insight-card">
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '10px', 
            background: 'var(--primary-light)', color: 'var(--primary-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '8px' }}>
              Personal Coach Insight
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {topMistakes.length > 0 && topMistakes[0].title !== "Missing 'a'/'the' articles"
                 ? `You're making great progress! We've noticed some challenges with ${topMistakes[0].title}. Keep focusing on that during your next chat session!` 
                 : "You're doing great! Your sentence structure is becoming more natural. Try focusing on using 'the' before specific nouns this week to reach the next fluency level."}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="ring-container">
          <div className="ring" style={{ '--percentage': `${metrics.fluency}%` }}>{metrics.fluency}%</div>
          <div className="ring-label">Fluency</div>
        </div>
        <div className="ring-container">
          <div className="ring" style={{ '--percentage': `${metrics.vocabulary}%` }}>{metrics.vocabulary}%</div>
          <div className="ring-label">Vocabulary</div>
        </div>
        <div className="ring-container">
          <div className="ring" style={{ '--percentage': `${metrics.grammar}%` }}>{metrics.grammar}%</div>
          <div className="ring-label">Grammar</div>
        </div>
        <div className="ring-container">
          <div className="ring" style={{ '--percentage': `${metrics.pronunciation}%` }}>{metrics.pronunciation}%</div>
          <div className="ring-label">Pronunciation</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
          <div className="text-h2" style={{ margin: 0 }}>Your Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trend.startsWith('-') ? 'var(--danger)' : 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>
            {trend.startsWith('-') ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            )}
            {trend} growth this period
          </div>
        </div>
        
        <div style={{ width: '100%', height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} dy={10} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--primary)" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: 'var(--primary-dark)' }}
                activeDot={{ r: 6, fill: 'var(--primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: '16px', marginTop: '24px' }}>
        <div className="text-h2" style={{ margin: 0 }}>Top Repeated Mistakes</div>
        {topMistakes.length > 0 && topMistakes[0].title !== "Missing 'a'/'the' articles" && (
           <div style={{ color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
             <Trophy size={14} /> Your Real Data
           </div>
        )}
      </div>

      <div className="card" style={{ padding: '12px 20px' }}>
        <div className="mistake-list">
          {topMistakes.map((mistake, index) => {
            const colors = getRankColors(index);
            return (
              <div className="mistake-item" key={index}>
                <div className="mistake-rank" style={{ background: colors.bg, color: colors.text }}>
                   {index + 1}
                </div>
                <div className="mistake-content">
                  <div className="mistake-title" style={{ fontSize: '0.85rem' }}>{mistake.title}</div>
                  <div className="mistake-desc">{mistake.desc}</div>
                </div>
                <div className="mistake-stats">
                  <div className="mistake-count" style={{ color: colors.text }}>{mistake.count} time{mistake.count !== 1 && 's'}</div>
                  <div className="mistake-trend">Repeated</div>
                </div>
              </div>
            );
          })}
          
          {topMistakes.length === 0 && (
             <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Start a conversation to generate your personalized mistake analysis!
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
