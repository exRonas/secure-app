import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MissionProvider } from './context/MissionContext'; // Import MissionProvider
import Landing from './pages/Landing';
import Login from './pages/Login';
import MissionControl from './pages/MissionControl'; // Replaced Dashboard
import { ShieldCheck } from 'lucide-react';
import './styles/main.css';
import './styles/glass.css';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <ShieldCheck color="var(--primary)" />
          <span className="text-gradient">SecureBox Academy</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-mute)', fontSize: '0.9rem' }}>Курс</Link>
          {user ? (
            <Link to="/missions" className="glass-btn" style={{ padding: '8px 20px' }}>MISSION CONTROL</Link>
          ) : (
             <Link to="/login" className="glass-btn" style={{ padding: '8px 20px' }}>Вход Курсанта</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading Secure Environment...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MissionProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/missions" element={
              <ProtectedRoute>
                <MissionControl />
              </ProtectedRoute>
            } />
            {/* Redirect old dashboard link if any */}
            <Route path="/dashboard" element={<Navigate to="/missions" />} />
          </Routes>
        </MissionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
