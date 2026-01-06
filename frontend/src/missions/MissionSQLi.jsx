import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMissions } from '../context/MissionContext';
import { Database, Search, AlertCircle, CheckCircle } from 'lucide-react';

const MissionSQLi = () => {
    const { api } = useAuth();
    const { refreshProgress, progress } = useMissions();
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isCompleted = progress['mission_sqli'] === 'completed';

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // Send query param to backend
            const res = await api.get(`/lab/target-sqli?query=${encodeURIComponent(query)}`);
            
            if (res.data.success) {
                setResults(res.data.data);
                if (res.data.data.length > 1) {
                    // Force refresh if we got the dump
                    await refreshProgress();
                }
            } else {
                setError(res.data.error);
            }
        } catch (err) {
            setError('Connection Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
            
            {/* LEFT: INJECTION PANEL */}
            <div className="glass-panel">
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Цель: База Данных</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>
                    Поле поиска уязвимо к SQL инъекциям. Попробуйте манипулировать логикой запроса.
                    <br/><br/>
                    SQL Запрос на сервере:
                    <br/>
                    <code style={{display:'block', padding:'10px', background:'#001', border:'1px solid #336', color:'#aaddff', marginTop:'5px'}}>
                        SELECT * FROM secrets WHERE code = '{query}'
                    </code>
                </p>

                <form onSubmit={handleSearch}>
                    <div className="input-with-icon">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="glass-input" 
                            placeholder="Введите код доступа..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    
                    <div style={{ textAlign: 'right', marginTop: '15px' }}>
                        <button className="glass-btn primary" disabled={loading}>
                            {loading ? 'ВЫПОЛНЕНИЕ...' : 'ПОИСК'} <Database size={16} style={{marginLeft:8}}/>
                        </button>
                    </div>
                </form>

                {/* HELPERS */}
                <div style={{marginTop: '30px', borderTop: '1px solid #334455', paddingTop: '10px'}}>
                    <small style={{color:'#557799'}}>ПОДСКАЗКА:</small>
                    <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                        <button 
                            className="glass-btn small" 
                            onClick={() => setQuery("' OR '1'='1")}
                        >
                            Использовать ' OR '1'='1
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: DATABASE OUTPUT */}
            <div className="glass-panel" style={{ 
                background: isCompleted ? 'rgba(0, 255, 0, 0.05)' : 'rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Результаты запроса</h3>
                    <div style={{ fontSize: '12px', color: isCompleted ? '#00ff88' : '#666' }}>
                        СТАТУС: {isCompleted ? 'УТЕЧКА ДАННЫХ' : 'ЗАЩИЩЕНО'}
                    </div>
                </div>

                <div style={{ 
                    flex: 1, 
                    background: '#050a10', 
                    border: '1px solid #112233', 
                    borderRadius: '4px', 
                    padding: '10px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                }}>
                    {loading && <div style={{color:'#00ffff'}}>Загрузка данных...</div>}
                    
                    {error && (
                        <div style={{color:'#ff3333', display:'flex', alignItems:'center', gap:'10px'}}>
                            <AlertCircle size={16}/> {error}
                        </div>
                    )}

                    {results && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaddff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #335577', color: '#00aaff' }}>
                                    <th style={{textAlign:'left', padding:'5px'}}>ID</th>
                                    <th style={{textAlign:'left', padding:'5px'}}>КОД</th>
                                    <th style={{textAlign:'left', padding:'5px'}}>СЕКРЕТ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #112233' }}>
                                        <td style={{padding:'5px'}}>{row.id}</td>
                                        <td style={{padding:'5px'}}>{row.code}</td>
                                        <td style={{padding:'5px', color:'#ffaa00'}}>{row.secret}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {!results && !loading && !error && (
                        <div style={{color:'#335577', textAlign:'center', marginTop:'50px'}}>
                            -- ОЖИДАНИЕ ЗАПРОСА --
                        </div>
                    )}
                </div>

                {isCompleted && (
                    <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 255, 100, 0.1)', border: '1px solid #00ff88', borderRadius: '4px', color: '#00ff88', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <CheckCircle size={24} />
                        <div>
                            <strong>МИССИЯ ВЫПОЛНЕНА</strong><br/>
                            Вы успешно извлекли скрытые записи из базы данных.
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MissionSQLi;
