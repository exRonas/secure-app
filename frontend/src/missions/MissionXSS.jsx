import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMissions } from '../context/MissionContext';
import { ShieldAlert, Bug } from 'lucide-react';

const MissionXSS = () => {
  const { api } = useAuth();
  const { refreshProgress, progress } = useMissions();
  
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [serverMsg, setServerMsg] = useState(null);

  const sendPayload = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/lab/target-xss', { content: note });
      
      const newEntry = {
        content: res.data.content,
        safe: true // In React, it's safe by default
      };
      setSavedNotes([newEntry, ...savedNotes]);
      
      if (res.data.mission_success) {
        setServerMsg(res.data.warning);
        await refreshProgress();
      } else {
        setServerMsg(null);
      }
      setNote('');
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = progress['mission_xss'] === 'completed';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      {/* LEFT: ATTACK PANEL */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Цель: Внедрение Кода</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>
          Попробуй отправить JavaScript код на сервер. <br/>
          Цель: Заставить сервер выполнить твой код.
        </p>

        {/* TOOLBAR FOR KIDS */}
        <div style={{ marginBottom: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', width: '100%' }}>БЫСТРЫЕ ИНСТРУМЕНТЫ:</span>
            <button className="glass-btn small" onClick={() => setNote("<script>alert('XSS')</script>")}>&lt;script&gt;</button>
            <button className="glass-btn small" onClick={() => setNote("<img src=x onerror=alert(1)>")}>&lt;img error&gt;</button>
            <button className="glass-btn small" onClick={() => setNote("<h1>HACKED</h1>")}>&lt;h1&gt;</button>
        </div>

        <form onSubmit={sendPayload}>
          <textarea 
            className="glass-input" 
            placeholder="Введите заметку..." 
            value={note}
            rows={4}
            onChange={e => setNote(e.target.value)}
          />
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
             <button className="glass-btn danger" type="submit">ОТПРАВИТЬ PAYLOAD</button>
          </div>
        </form>

        <div style={{ marginTop: '20px' }}>
          <h4>Вывод браузера (Rendered):</h4>
          <div style={{ background: 'rgba(10, 15, 20, 0.6)', border: '1px solid #005577', color: '#aaddff', padding: '15px', borderRadius: '4px', minHeight: '100px' }}>
             {savedNotes.length === 0 && <span style={{color:'rgba(170, 221, 255, 0.5)'}}>Заметок пока нет.</span>}
             {savedNotes.map((n, i) => (
               <div key={i} style={{ borderBottom: '1px solid rgba(0, 85, 119, 0.3)', padding: '5px 0' }}>
                 {/* REACT AUTOMATICALLY ESCAPES THIS */}
                 {n.content}
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* RIGHT: DEBRIEF */}
      <div className="glass-panel" style={{ background: isCompleted ? 'rgba(0, 255, 0, 0.05)' : '' }}>
        <h3>Статус Миссии</h3>
        {isCompleted ? (
          <div>
             <div style={{ color: '#0f0', fontSize: '1.2rem', margin: '1rem 0', fontWeight: 'bold' }}>
              ✅ АТАКА НЕЙТРАЛИЗОВАНА
            </div>
            <p>Ты увидел, что браузер отобразил код как текст, а не запустил его.</p>
            
            <div style={{ marginTop: '1rem' }}>
              <strong>Почему это произошло?</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)' }}>
                React автоматически кодирует спецсимволы перед вставкой в DOM.
              </p>
            </div>
            
            <div style={{ background: '#222', padding: '10px', borderRadius: '4px', margin: '1rem 0' }}>
               <div style={{ color: '#aaa' }}>Твой ввод: {'<script>'}</div>
               <div style={{ color: '#0f0' }}>Браузер видит: &amp;lt;script&amp;gt;</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--text-mute)' }}>
            <Bug size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Ожидание внедрения скрипта...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionXSS;
