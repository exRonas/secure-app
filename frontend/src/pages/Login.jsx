import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await register(username, password);
      else await login(username, password);
      navigate('/missions');
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-70px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isRegister ? 'New Agent' : 'Agent Login'}
        </h2>

        {error && (
          <div style={{ background: 'rgba(255, 0, 85, 0.2)', color: '#ffaaaa', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid rgba(255,0,85,0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-mute)', fontSize: '0.9rem' }}>AGENT ID (Login)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-mute)' }} />
              <input 
                className="glass-input" 
                style={{ paddingLeft: '40px' }}
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Agent007"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-mute)', fontSize: '0.9rem' }}>ACCESS CODE</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-mute)' }} />
              <input 
                className="glass-input" 
                type="password"
                style={{ paddingLeft: '40px' }}
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {isRegister && <div style={{ fontSize: '0.75rem', color: 'var(--text-mute)', marginTop: '5px' }}>Мин. 8 символов</div>}
          </div>

          <button className="glass-btn" type="submit">
            {isRegister ? 'INITIALIZE PROFILE' : 'ACCESS TERMINAL'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-mute)' }}>
          {isRegister ? 'Already verified? ' : 'New recruit? '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Login' : 'Initialize Profile'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
