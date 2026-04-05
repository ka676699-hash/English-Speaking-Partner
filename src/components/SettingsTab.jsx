import { useState, useEffect } from 'react';
import { User, Volume2, Globe, Shield, RefreshCcw } from 'lucide-react';

export default function SettingsTab() {
  const [voice, setVoice] = useState('female');
  const [level, setLevel] = useState('intermediate');
  const [corrections, setCorrections] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('app_settings'));
      if (saved) {
        setVoice(saved.voice || 'female');
        setLevel(saved.level || 'intermediate');
        setCorrections(saved.corrections !== undefined ? saved.corrections : true);
      }
    } catch(e) {}
  }, []);

  // Save to localStorage whenever anything changes
  useEffect(() => {
    const settings = { voice, level, corrections };
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [voice, level, corrections]);

  const clearHistory = () => {
    if (window.confirm("Clear all your conversation progress and analytics?")) {
      localStorage.removeItem('app_metrics');
      localStorage.removeItem('app_mistakes');
      alert("Progress cleared!");
      window.location.reload();
    }
  };

  return (
    <div className="flex-col">
      <h1 className="text-h1">Settings</h1>
      <p className="text-sub">Personalize your learning experience</p>

      {/* Voice Selection */}
      <h2 className="text-h2"><User size={18} style={{marginRight:8}}/>AI Teacher Voice</h2>
      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div 
          className={`radio-box ${voice === 'female' ? 'active' : ''}`}
          onClick={() => setVoice('female')}
        >
          <div className="radio-circle"></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sarah</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Warm & Friendly</div>
          </div>
        </div>
        <div 
          className={`radio-box ${voice === 'male' ? 'active' : ''}`}
          onClick={() => setVoice('male')}
        >
          <div className="radio-circle"></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>David</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clear & Concise</div>
          </div>
        </div>
      </div>

      {/* Level Selection */}
      <h2 className="text-h2"><Globe size={18} style={{marginRight:8}}/>Speaking Level</h2>
      <div className="flex-col gap-3" style={{ marginBottom: 32 }}>
        <div 
          className={`radio-box ${level === 'beginner' ? 'active' : ''}`}
          onClick={() => setLevel('beginner')}
        >
          <div className="radio-circle"></div>
          <div className="flex-col">
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Beginner (A1-A2)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Simple words, slow speech</div>
          </div>
        </div>
        <div 
          className={`radio-box ${level === 'intermediate' ? 'active' : ''}`}
          onClick={() => setLevel('intermediate')}
        >
          <div className="radio-circle"></div>
          <div className="flex-col">
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Intermediate (B1-B2)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Natural pace, common topics</div>
          </div>
        </div>
        <div 
          className={`radio-box ${level === 'advanced' ? 'active' : ''}`}
          onClick={() => setLevel('advanced')}
        >
          <div className="radio-circle"></div>
          <div className="flex-col">
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Advanced (C1-C2)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Complex idioms, fast speech</div>
          </div>
        </div>
      </div>

      {/* Correction Settings */}
      <div className="card flex items-center justify-between" style={{ marginBottom: 32 }}>
        <div className="flex items-center gap-3">
          <Shield size={20} color="var(--primary-dark)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Real-time Corrections</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Show mistake alerts while talking</div>
          </div>
        </div>
        <div 
          className={`toggle-switch ${corrections ? 'active' : ''}`}
          onClick={() => setCorrections(!corrections)}
        ></div>
      </div>

      <button className="btn-danger-light" onClick={clearHistory}>
        <RefreshCcw size={18} />
        Reset All Progress
      </button>
      
      <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: '0.7rem' }}>
        LingoCompanion v1.0.4<br/>
        Made with ❤️ for English Learners
      </div>
    </div>
  );
}
