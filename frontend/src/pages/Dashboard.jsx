import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Plus, Terminal } from 'lucide-react';

const Dashboard = () => {
  const { user, api, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    api.get('/lab/notes').then(res => setNotes(res.data));
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    await api.post('/lab/notes', { content: newNote });
    setNewNote('');
    fetchNotes();
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Секретная Лаборатория</h1>
          <p style={{ color: 'var(--text-mute)' }}>Добро пожаловать, Агент {user.username}</p>
        </div>
        <button className="glass-btn danger" onClick={logout}>Отключиться</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* LEFT: WORKSPACE */}
        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} color="var(--primary)" /> 
              Ввод данных в Хранилище
            </h3>
            <form onSubmit={addNote}>
              <textarea 
                className="glass-input" 
                rows="3" 
                placeholder="Введите секретные данные или попробуйте XSS атаку: <script>alert(1)</script>"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              ></textarea>
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button className="glass-btn" type="submit">Зашифровать и Сохранить</button>
              </div>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {notes.map(note => (
              <div key={note.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-mute)', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  {new Date(note.created_at).toLocaleString()}
                </div>
                <div style={{ fontSize: '1.1rem', wordBreak: 'break-all' }}>
                  {/* REACT SAFE RENDER */}
                  {note.content}
                </div>
              </div>
            ))}
            {notes.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '2rem' }}>Хранилище пусто.</div>}
          </div>
        </div>

        {/* RIGHT: INFO PANEL */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
            <h4 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle size={20} />
              Режим обучения
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>
              Попробуй ввести этот вредоносный код в форму:
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#ff5555', wordBreak: 'break-all', marginBottom: '1rem' }}>
              &lt;img src=x onerror=alert(1)&gt;
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)' }}>
              <b>Результат:</b> В отличие от старых сайтов, ничего не произойдет. <br/><br/>
              <b>Почему?</b> React автоматически воспринимает твой ввод как <i>текст</i>, а не код. Браузер рисует символы, но не выполняет их.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
