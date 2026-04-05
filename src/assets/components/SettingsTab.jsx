import { useState, useEffect } from 'react';
import { Edit2, Bell, Sparkles, Database, LogOut, Check } from 'lucide-react';

export default function SettingsTab() {
  const [voice, setVoice] = useState('female');
  const [level, setLevel] = useState('intermediate');
  const [correctionsEnabled, setCorrectionsEnabled] = useState(true);

  // Load initially
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('app_settings'));
      if (saved) {
        if (saved.voice) setVoice(saved.voice);
        if (saved.level) setLevel(saved.level);
        if (saved.corrections !== undefined) setCorrectionsEnabled(saved.corrections);
      }
    } catch(e) {}
  }, []);

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem('app_settings', JSON.stringify({
        voice, level, corrections: correctionsEnabled
      }));
    } catch(e) {}
  }, [voice, level, correctionsEnabled]);

  return (
    <div style={{ paddingBottom: '20px' }}>
      
      {/* Profile Section */}
      <div className="flex-col items-center" style={{ marginBottom: '32px', marginTop: '10px' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Profile" 
            style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid white', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <div style={{
            position: 'absolute', bottom: '0px', right: '0px',
            width: '28px', height: '28px', backgroundColor: 'var(--success)',
            borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <Edit2 size={12} />
          </div>
        </div>
        <div className="text-h1" style={{ fontSize: '1.3rem' }}>Alex Morgan</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          English Learner <span style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>•</span> 42 Day Streak
        </div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
        <div className="text-h2" style={{ margin: 0 }}>AI Voice Profile</div>
        <div style={{ color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
          Customizable Audio
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div 
          onClick={() => setVoice('female')}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: voice === 'female' ? '2px solid var(--primary-light)' : '2px solid transparent',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', fontSize: '1.2rem'
          }}>
            ♀
          </div>
          <div style={{ fontWeight: '700', marginBottom: '4px', textAlign: 'center' }}>Female<br/>Teacher</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>Soft & Supportive</div>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: voice === 'female' ? 'var(--primary-dark)' : 'transparent',
            border: voice === 'female' ? 'none' : '2px solid #cbd5e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            {voice === 'female' && <Check size={14} />}
          </div>
        </div>

        <div 
          onClick={() => setVoice('male')}
          style={{
            background: voice === 'male' ? 'white' : '#f1f5f9',
            borderRadius: '24px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: voice === 'male' ? '2px solid var(--primary-dark)' : '2px solid transparent',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: voice === 'male' ? 'var(--primary-dark)' : '#cbd5e1', color: voice === 'male' ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', fontSize: '1.2rem'
          }}>
            ♂
          </div>
          <div style={{ fontWeight: '700', marginBottom: '4px', textAlign: 'center' }}>Male<br/>Teacher</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>Steady & Technical</div>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: voice === 'male' ? 'var(--primary-dark)' : 'transparent',
            border: voice === 'male' ? 'none' : '2px solid #cbd5e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            {voice === 'male' && <Check size={14} />}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--primary-dark)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
          <div className="text-h2" style={{ margin: 0 }}>Speaking Level</div>
        </div>

        <div 
          className={`radio-box ${level === 'beginner' ? 'active' : ''}`}
          onClick={() => setLevel('beginner')}
        >
          <div className="radio-circle"></div>
          <div style={{ flex: 1, fontWeight: '600', color: level === 'beginner' ? 'var(--primary-dark)' : 'inherit' }}>Beginner</div>
          <div style={{ fontSize: '0.75rem', background: level === 'beginner' ? 'var(--primary)' : '#e2e8f0', padding: '4px 10px', borderRadius: '12px', color: level === 'beginner' ? 'white' : 'var(--text-muted)', fontWeight: level === 'beginner' ? '600' : 'normal' }}>A1-A2</div>
        </div>

        <div 
          className={`radio-box ${level === 'intermediate' ? 'active' : ''}`}
          onClick={() => setLevel('intermediate')}
        >
          <div className="radio-circle"></div>
          <div style={{ flex: 1, fontWeight: '600', color: level === 'intermediate' ? 'var(--primary-dark)' : 'inherit' }}>Intermediate</div>
          <div style={{ fontSize: '0.75rem', background: level === 'intermediate' ? 'var(--primary)' : '#e2e8f0', padding: '4px 10px', borderRadius: '12px', color: level === 'intermediate' ? 'white' : 'var(--text-muted)', fontWeight: level === 'intermediate' ? '600' : 'normal' }}>B1-B2</div>
        </div>

        <div 
          className={`radio-box ${level === 'advanced' ? 'active' : ''}`}
          onClick={() => setLevel('advanced')}
        >
          <div className="radio-circle"></div>
          <div style={{ flex: 1, fontWeight: '600', color: level === 'advanced' ? 'var(--primary-dark)' : 'inherit' }}>Advanced</div>
          <div style={{ fontSize: '0.75rem', background: level === 'advanced' ? 'var(--primary)' : '#e2e8f0', padding: '4px 10px', borderRadius: '12px', color: level === 'advanced' ? 'white' : 'var(--text-muted)', fontWeight: level === 'advanced' ? '600' : 'normal' }}>C1-C2</div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Daily Reminder</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Stay consistent with practice</div>
            </div>
          </div>
          <div style={{ background: '#e2e8f0', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
            07 : 00 PM
          </div>
        </div>

        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setCorrectionsEnabled(!correctionsEnabled)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Enable real-time corrections</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant feedback during talk</div>
            </div>
          </div>
          <div 
            className={`toggle-switch ${correctionsEnabled ? 'active' : ''}`}
          ></div>
        </div>

        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Database size={20} />
            </div>
            <div style={{ fontWeight: '600' }}>Data Management</div>
          </div>
          <div style={{ color: '#94a3b8' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <button className="btn-danger-light" style={{ marginTop: '32px' }}>
        <LogOut size={20} />
        Log out
      </button>

    </div>
  );
}
