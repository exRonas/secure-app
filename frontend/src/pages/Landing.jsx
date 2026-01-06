import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ paddingTop: '80px' }}>
            {/* HERO */}
            <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: -1
                }}></div>

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ width: '8px', height: '8px', background: '#0f0', borderRadius: '50%' }}></span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-mute)' }}>Secure Environment Active</span>
                        </div>

                        <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                            Master Cyber Security<br />
                            <span className="text-gradient">By Breaking It.</span>
                        </h1>

                        <p style={{ fontSize: '1.2rem', color: 'var(--text-mute)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                            Интерактивная платформа для обучения этичному хакингу.
                            Взламывайте макеты реальных приложений в безопасной песочнице.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <Link to="/missions" className="glass-btn primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                                НАЧАТЬ МИССИЮ
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
