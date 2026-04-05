import { useState, useEffect } from 'react';
import SpeakTab from './components/SpeakTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import { Mic, BarChart3, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('speak');

  return (
    <div className="mobile-container">
      {/* Dynamic Header can be tab-specific if needed */}
      
      <div className="app-content">
        {activeTab === 'speak' && <SpeakTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={24} />
          <span>Analytics</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'speak' ? 'active' : ''}`}
          onClick={() => setActiveTab('speak')}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: activeTab === 'speak' ? 'var(--primary-dark)' : 'white',
            color: activeTab === 'speak' ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '-30px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.1)',
            border: activeTab === 'speak' ? 'none' : '1px solid var(--border)',
            transition: 'all 0.3s'
          }}>
            <Mic size={28} />
          </div>
          <span style={{ color: activeTab === 'speak' ? 'var(--primary-dark)' : 'inherit' }}>Speak</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={24} />
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
