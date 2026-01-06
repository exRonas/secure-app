import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMissions } from '../context/MissionContext';
import { Lock, AlertCircle } from 'lucide-react';

const MissionBruteForce = () => {
  const { api } = useAuth();
  const { refreshProgress, progress } = useMissions();
  
  const [targetPassword, setTargetPassword] = useState('');
  const [log, setLog] = useState([]);
  const [locked, setLocked] = useState(false);

  // Auto-scroll log
  const logBoxRef = React.useRef(null);
  React.useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [log]);

  const attack = async (e) => {
    e.preventDefault();
    if (locked) return;

    const attempt = targetPassword || '123456';
    setLog(prev => [...prev, `[SEND] POST /api/login payload={user: 'admin', pass: '${attempt}'}`]);

    try {
      await api.post('/lab/target-login', { password: attempt });
      setLog(prev => [...prev, `[RECV] 401 Unauthorized`]);
      setTargetPassword('');
    } catch (err) {
      if (err.response && err.response.status === 429) {
        // SUCCESS CASE
        setLog(prev => [...prev, `[RECV] 429 TOO MANY REQUESTS`]);
        setLog(prev => [...prev, `[SYSTEM] 🏆 PROTECTION TRIGGERED!`]);
        setLocked(true);
        await refreshProgress();
      } else {
        setLog(prev => [...prev, `[RECV] 401 Unauthorized`]);
      }
    }
  };

  const isCompleted = progress['mission_bruteforce'] === 'completed';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      {/* LEFT: ATTACK PANEL */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Цель: admin</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>
          Задача: Выбрать такой темп атаки, чтобы сработала автоматическая защита сервера.
          Жми кнопку LOGIN как можно быстрее!
        </p>

        <form onSubmit={attack} style={{ display: 'flex', gap: '10px' }}>
          <input 
            className="glass-input" 
            placeholder="пароль..." 
            value={targetPassword}
            onChange={e => setTargetPassword(e.target.value)}
          />
          <button className="glass-btn danger" type="submit">АТАКА (ВХОД)</button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <h4>ТЕРМИНАЛ:</h4>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>ПОДКЛЮЧЕНО: PORT 22</span>
          </div>
          <div ref={logBoxRef} style={{ background: '#000', padding: '10px', height: '200px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', color: '#0f0', borderRadius: '4px', border: '1px solid #333' }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
            {log.length === 0 && <span style={{opacity:0.5}}>{'> Система готова... Ожидание ввода...'}</span>}
          </div>
        </div>
      </div>

      {/* RIGHT: DEBRIEF */}
      <div className="glass-panel" style={{ background: isCompleted ? 'rgba(0, 255, 0, 0.05)' : '' }}>
        <h3>Статус Миссии</h3>
        {isCompleted ? (
          <div>
            <div style={{ color: '#0f0', fontSize: '1.2rem', margin: '1rem 0', fontWeight: 'bold' }}>
              ✅ ЗАЩИТА АКТИВИРОВАНА
            </div>
            <p>Отличная работа, Агент. Сервер зафиксировал аномальную активность и заблокировал ваш IP.</p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', margin: '1rem 0' }}>
              <code style={{color: '#aaa'}}>// Логика Защиты (Backend)</code><br/>
              <code style={{color: 'var(--primary)'}}>rateLimit({'{'}</code><br/>
              <code>&nbsp;&nbsp;windowMs: 60000,</code><br/>
              <code>&nbsp;&nbsp;max: 5, <span style={{color: '#555'}}>// Блок после 5 попыток</span></code><br/>
              <code style={{color: 'var(--primary)'}}>{'}'})</code>
            </div>
            <p style={{fontSize:'0.9rem', color:'var(--text-mute)'}}>В реальной системе это предотвращает подбор паролей ботами.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--text-mute)' }}>
            <Lock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Ожидание инцидента безопасности...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionBruteForce;
