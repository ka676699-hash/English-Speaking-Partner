import { useState } from 'react';
import { Mic, BarChart2, Settings, Bell } from 'lucide-react';
import './index.css';

import SpeakTab from './components/SpeakTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';

function App() {
  const [activeTab, setActiveTab] = useState('speak'); // 'speak', 'analytics', 'settings'

  const renderContent = () => {
    switch (activeTab) {
      case 'speak':
        return <SpeakTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <SpeakTab />;
    }
  };

  return (
    <>
      <header className="header">
        <div className="brand">
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
            L
          </div>
          LingoCompanion
        </div>
        <div className="header-actions">
          {activeTab !== 'settings' && (
            <div style={{ position: 'relative' }}>
              <Bell size={20} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></div>
            </div>
          )}
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Profile" className="avatar" />
        </div>
      </header>

      <div className="container">
        {renderContent()}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'speak' ? 'active' : ''}`}
          onClick={() => setActiveTab('speak')}
        >
          <Mic size={24} />
          <span>Speak</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 size={24} />
          <span>Analytics</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={24} />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
}

export default App;
