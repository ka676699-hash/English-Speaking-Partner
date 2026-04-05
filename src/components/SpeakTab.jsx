import { useState, useEffect, useRef } from 'react';
import { Mic, Sparkles, AlertCircle, Square } from 'lucide-react';

export default function SpeakTab() {
  const [isListening, setIsListening] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appSettings, setAppSettings] = useState({ voice: 'female', level: 'intermediate', corrections: true });

  const [messages, setMessages] = useState([]);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Load voices securely to bypass Chrome's getVoices() empty array bug
  useEffect(() => {
    const loadVoices = () => { setAvailableVoices(window.speechSynthesis.getVoices()); };
    loadVoices();
    if (window.speechSynthesis) {
       window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Load Settings and Initial message
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('app_settings')) || { voice: 'female', level: 'intermediate', corrections: true };
      setAppSettings(saved);
      const name = saved.voice === 'male' ? 'David' : 'Sarah';
      setMessages([{ id: 1, type: 'ai', text: `Hi Alex! It's ${name}. Tap the mic to start our conversation!` }]);
    } catch(e) {}
  }, []);

  const isMale = appSettings.voice === 'male';
  const teacherName = isMale ? "David" : "Sarah";
  const avatarUrl = isMale 
    ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" 
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200";

  const recognitionRef = useRef(null);
  const conversationModeRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isLoadingRef = useRef(false);
  
  // Buffers for 2-second delay logic
  const transcriptBufferRef = useRef('');
  const stopTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    conversationModeRef.current = conversationMode;
  }, [conversationMode]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        transcriptBufferRef.current = '';
      };

      recognition.onresult = (event) => {
        let newText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newText += event.results[i][0].transcript + ' ';
          }
        }

        if (newText.trim() !== '') {
          transcriptBufferRef.current += newText;
          if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
          
          stopTimeoutRef.current = setTimeout(() => {
            const fullText = transcriptBufferRef.current.trim();
            if (fullText) {
              handleUserMessage(fullText);
              transcriptBufferRef.current = '';
              recognition.stop(); 
            }
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (conversationModeRef.current && !isSpeakingRef.current && !isLoadingRef.current) {
          setTimeout(() => {
            if (conversationModeRef.current && !isSpeakingRef.current && !isLoadingRef.current) {
              try { recognition.start(); } catch (e) {}
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  const toggleConversation = () => {
    if (conversationMode) {
      setConversationMode(false);
      recognitionRef.current?.stop();
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      window.speechSynthesis.cancel();
    } else {
      setConversationMode(true);
      try { recognitionRef.current?.start(); } catch (e) {}
    }
  };

  const handleUserMessage = (text) => {
    setMessages((prev) => {
      const newMessages = [...prev, { id: Date.now(), type: 'user', text }];
      fetchChat(text, newMessages);
      return newMessages;
    });
  };

  const fetchChat = async (text, currentHistory) => {
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/chat';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: currentHistory,
          settings: appSettings 
        })
      });

      const data = await response.json();
      const aiResponseMessages = [];
      const now = Date.now();
      
      // Save Metrics
      if (data.metrics) {
        try {
          const historicalMetrics = JSON.parse(localStorage.getItem('app_metrics') || '[]');
          historicalMetrics.push({ date: new Date().toISOString(), metrics: data.metrics });
          localStorage.setItem('app_metrics', JSON.stringify(historicalMetrics));
        } catch(e) {}
      }

      if (data.response) {
        aiResponseMessages.push({ id: now + 1, type: 'ai', text: data.response });
        speakText(data.response);
      }
      
      if (data.correction && appSettings.corrections !== false) {
        aiResponseMessages.push({ 
          id: now + 2, 
          type: 'correction', 
          title: data.correction.title,
          text: data.correction.text 
        });
        
        try {
          if (data.correction.mistake_category) {
            const mistakes = JSON.parse(localStorage.getItem('app_mistakes') || '[]');
            mistakes.push({
              title: data.correction.mistake_category,
              desc: "Tip: " + data.correction.text,
              date: new Date().toISOString()
            });
            localStorage.setItem('app_mistakes', JSON.stringify(mistakes));
          }
        } catch(e) {}
      } else if (data.correction && appSettings.corrections === false) {
          try {
            if (data.correction.mistake_category) {
              const mistakes = JSON.parse(localStorage.getItem('app_mistakes') || '[]');
              mistakes.push({
                title: data.correction.mistake_category,
                desc: "Tip: " + data.correction.text,
                date: new Date().toISOString()
              });
              localStorage.setItem('app_mistakes', JSON.stringify(mistakes));
            }
          } catch(e) {}
      }

      setMessages(prev => [...prev, ...aiResponseMessages]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'correction', title: 'SYSTEM ERROR', text: 'Backend is not reachable.' }]);
      if (conversationModeRef.current) {
        setTimeout(() => { try { recognitionRef.current?.start(); } catch (e) {} }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      
      if (appSettings.level === 'beginner') utterance.rate = 0.85;
      else if (appSettings.level === 'intermediate') utterance.rate = 1.0;
      else if (appSettings.level === 'advanced') utterance.rate = 1.15;
      
      // Use the safely loaded voices
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      
      if (appSettings.voice === 'male') {
         const maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George')));
         if (maleVoice) {
           utterance.voice = maleVoice;
         } else {
           const fallback = voices.find(v => v.lang.startsWith('en'));
           if (fallback) utterance.voice = fallback;
           utterance.pitch = 0.6; // Deepen structurally
         }
      } else {
         const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English')));
         if (femaleVoice) {
           utterance.voice = femaleVoice;
         } else {
           utterance.pitch = 1.1; 
         }
      }
      
      utterance.onstart = () => { isSpeakingRef.current = true; };
      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (conversationModeRef.current) {
          setTimeout(() => {
            if (conversationModeRef.current) try { recognitionRef.current?.start(); } catch (e) {}
          }, 300);
        }
      };
      utterance.onerror = () => {
         isSpeakingRef.current = false;
         if (conversationModeRef.current) {
            setTimeout(() => { try { recognitionRef.current?.start(); } catch(e) {} }, 300);
         }
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Teacher Profile Header */}
      <div className="flex-col items-center" style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', padding: '4px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' 
          }}>
            <img 
              src={avatarUrl}
              alt="Teacher" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }}
            />
          </div>
          <div style={{
            position: 'absolute', bottom: '4px', right: '4px',
            width: '16px', height: '16px', backgroundColor: 'var(--success)',
            borderRadius: '50%', border: '2px solid white'
          }}></div>
        </div>
        <div style={{ color: 'var(--primary-dark)', fontWeight: '600', fontSize: '1.1rem' }}>
          Chatting with {teacherName}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
          Topic: Daily Routines <span style={{opacity:0.5}}>({appSettings.level})</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-container" ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
        {messages.map((msg) => {
          if (msg.type === 'user') return <div key={msg.id} className="message user">{msg.text}</div>;
          if (msg.type === 'ai') return <div key={msg.id} className="message ai">{msg.text}</div>;
          if (msg.type === 'correction') {
            return (
              <div key={msg.id} className="correction-box" style={{ 
                borderLeftColor: msg.title === 'SYSTEM ERROR' ? 'var(--danger)' : 'var(--success)',
                backgroundColor: msg.title === 'SYSTEM ERROR' ? 'var(--danger-light)' : '#f0fdf4'
              }}>
                <div className="correction-title" style={{ color: msg.title === 'SYSTEM ERROR' ? 'var(--danger)' : 'var(--primary-dark)' }}>
                  {msg.title === 'SYSTEM ERROR' ? <AlertCircle size={14} /> : <Sparkles size={14} />}
                  {msg.title}
                </div>
                <div>{msg.text}</div>
              </div>
            );
          }
          return null;
        })}
        
        {isLoading && (
           <div className="message ai" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
             <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
             <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></div>
             <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></div>
           </div>
        )}
      </div>

      {/* Mic Area */}
      <div className="mic-wrapper" style={{ marginTop: '10px' }}>
        {isListening || isLoading ? (
          <div className="status-pill">
            <div className="status-dot" style={{ backgroundColor: isLoading ? 'var(--text-muted)' : 'var(--primary-dark)' }}></div>
            {isLoading ? `${teacherName} is typing...` : 'Listening...'}
          </div>
        ) : (
           <div className="status-pill" style={{ opacity: 0 }}>Placeholder</div>
        )}
        
        <button 
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleConversation}
          style={{ 
            background: conversationMode ? 'white' : 'linear-gradient(135deg, #34d399, #2dd4bf)',
            border: conversationMode ? '2px solid var(--danger)' : 'none',
            color: conversationMode ? 'var(--danger)' : 'white',
            transition: 'all 0.3s'
          }}
        >
          {conversationMode ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
        </button>
        
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
          {conversationMode ? 'Tap to stop conversation' : 'Tap to start conversation'}
        </div>
      </div>
    </div>
  );
}
