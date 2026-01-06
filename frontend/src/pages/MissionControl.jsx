import React, { useState, useEffect } from 'react';
import { useMissions } from '../context/MissionContext';
import { useAuth } from '../context/AuthContext';
import MissionBruteForce from '../missions/MissionBruteForce';
import MissionXSS from '../missions/MissionXSS';
import MissionSQLi from '../missions/MissionSQLi';
import KeyObject3D from '../components/KeyObject3D';
import { Lock, Shield, Database, ChevronLeft, Flag, Crosshair, AlertTriangle } from 'lucide-react';
import '../styles/mission.css';

const Typewriter = ({ text, speed = 20, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return <div style={{ whiteSpace: 'pre-line', minHeight: '100px' }}>{displayed}<span className="cursor-blink">|</span></div>;
};

const MissionControl = () => {
  const { user } = useAuth();
  const { progress } = useMissions();
  const [activeMission, setActiveMission] = useState(null); 
  const [missionStage, setMissionStage] = useState('BRIEFING'); // BRIEFING | ACTION
  const [hoveredMission, setHoveredMission] = useState(null);

  // Define Missions
  const missions = [
    { 
      id: 'bruteforce', 
      title: 'ОПЕРАЦИЯ: BRUTE', 
      subtitle: 'Цель: Аутентификация',
      desc: 'Проникновение в систему через подбор пароля.',
      briefing: {
        title: 'Протокол обхода аутентификации',
        text: 'ЦЕЛЬ: Получить несанкционированный доступ к панели администратора.\n\nТЕОРИЯ: Атака «Brute Force» (полный перебор) подразумевает систематический перебор паролей до нахождения правильного. Хотя автоматизированные инструменты просты, они могут перебирать миллионы комбинаций в секунду.\n\nВАША ЗАДАЧА: Целевая система имеет слабую защиту от перебора. Подберите правильный пароль для взлома периметра.'
      },
      icon: <Crosshair size={32} />,
      locked: false 
    },
    { 
      id: 'xss', 
      title: 'ОПЕРАЦИЯ: INJECT', 
      subtitle: 'Цель: Пользовательский ввод',
      desc: 'Внедрение вредоносного кода в базу данных заметок.',
      briefing: {
        title: 'Межсайтовый скриптинг (XSS)',
        text: 'ЦЕЛЬ: Внедрить исполняемый код в просмотрщик жертвы.\n\nТЕОРИЯ: XSS возникает, когда приложение включает ненадежные данные в веб-страницу без надлежащей проверки или экранирования. Это позволяет злоумышленникам выполнять скрипты в браузере жертвы.\n\nВАША ЗАДАЧА: Система заметок отображает HTML напрямую. Внедрите скрипт для компрометации просмотрщика.'
      },
      icon: <Flag size={32} />,
      locked: progress['mission_bruteforce'] !== 'completed'
    },
    { 
      id: 'sqli', 
      title: 'ОПЕРАЦИЯ: DUMP',
      subtitle: 'Цель: База Данных',
      desc: 'Извлечение скрытых данных. ТРЕБУЕТСЯ УРОВЕНЬ 3.',
      briefing: { 
        title: 'SQL-инъекция (SQLi)', 
        text: 'ЦЕЛЬ: Извлечь скрытые данные из базы.\n\nТЕОРИЯ: SQL-инъекция происходит, когда хакер вмешивается в запросы приложения к базе данных. Это позволяет просматривать данные, к которым у вас нет доступа.\n\nВАША ЗАДАЧА: Поисковая строка уязвима. Используйте специальный код, чтобы обмануть базу данных и показать все секреты.'
      },
      icon: <AlertTriangle size={32} />,
      locked: progress['mission_xss'] !== 'completed'
    },
  ];

  /* --- RENDER TACTICAL TABLE (MAIN MENU) --- */
  if (!activeMission) {
    const currentInfo = hoveredMission 
      ? missions.find(m => m.id === hoveredMission) 
      : { title: 'ОЖИДАНИЕ ВВОДА...', desc: 'Выберите цель миссии для продолжения.' };

    return (
      <div className="mission-scene">
        
        {/* Header Overlay */}
        <div className="tactical-title">
          ТАКТИЧЕСКИЙ ОБЗОР // АГЕНТ: {user?.username}
        </div>

        {/* 3D Table */}
        <div className="tactical-table">
          {missions.map((m, index) => {
             const isCompleted = progress[`mission_${m.id}`] === 'completed';
             
             return (
              <div 
                key={m.id} 
                className={`mission-point pos-${index} ${m.locked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (!m.locked) {
                    setActiveMission(m.id);
                    setMissionStage('BRIEFING');
                  }
                }}
                onMouseEnter={() => setHoveredMission(m.id)}
                onMouseLeave={() => setHoveredMission(null)}
              >
                <div className="base-marker"></div>
                <div className="connector-line"></div>
                <div className="floating-icon">
                  {m.icon}
                </div>
                
                <div className="mission-info">
                  <h3>{m.title}</h3>
                  <p>СТАТУС: {m.locked ? 'ЗАБЛОКИРОВАНО' : isCompleted ? 'ВЫПОЛНЕНО' : 'АКТИВНО'}</p>
                  <p>{m.subtitle}</p>
                  <p className="click-hint">[НАЖМИТЕ ДЛЯ ЗАПУСКА]</p>
                </div>
              </div>
            );
          })}

          <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#005577' }}>КООРД: 45.22.11 N // СЕКТОР 7</div>
        </div>

        {/* HUD Panel */}
        <div className="hud-panel">
          <div>
              <div className="hud-objective-label">ТЕКУЩАЯ ЦЕЛЬ</div>
              <div className="hud-objective-title" style={{ color: currentInfo.locked ? '#ff3333' : '#e0f0ff' }}>
                {currentInfo.title}
              </div>
              <div className="hud-objective-desc">
                // {currentInfo.desc}
              </div>
          </div>
        </div>

      </div>
    );
  }

  // Get active mission data
  const missionData = missions.find(m => m.id === activeMission);

  /* --- RENDER ACTIVE MISSION WORKSPACE --- */
  return (
    <div className="mission-helper workspace-layout">
      {/* Header */}
      <header className="workspace-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="back-btn" onClick={() => setActiveMission(null)}>
            <ChevronLeft size={16} /> ТАКТИЧЕСКАЯ КАРТА
          </button>
          
          {missionStage === 'ACTION' && (
              <button className="back-btn" onClick={() => setMissionStage('BRIEFING')}>
                <ChevronLeft size={16} /> БРИФИНГ
              </button>
          )}

          <h3 style={{ margin: 0, color: '#aaddff' }}>
             МИССИЯ: {activeMission.toUpperCase()} // {missionStage === 'BRIEFING' ? 'БРИФИНГ' : 'ДЕЙСТВИЕ'}
          </h3>
        </div>
        <div>
           {progress[`mission_${activeMission}`] === 'completed' && <span style={{ color: '#00ff88' }}>МИССИЯ ВЫПОЛНЕНА</span>}
        </div>
      </header>
      
      {/* Content Area */}
      <div className="workspace-content">
        
        {/* STAGE 1: BRIEFING / THEORY */}
        {missionStage === 'BRIEFING' && (
           <div className="briefing-container">
              <div className="briefing-visual">
                  <KeyObject3D />
              </div>
              <div className="briefing-content">
                  <div className="briefing-title">{missionData.briefing?.title}</div>
                  <div className="briefing-text">
                    <Typewriter text={missionData.briefing?.text} speed={15} />
                  </div>
                  <button className="start-mission-btn" onClick={() => setMissionStage('ACTION')}>
                    НАЧАТЬ ОПЕРАЦИЮ
                  </button>
              </div>
           </div>
        )}

        {/* STAGE 2: ACTION / GAMEPLAY */}
        {missionStage === 'ACTION' && (
          <>
            {activeMission === 'bruteforce' && <MissionBruteForce />}
            {activeMission === 'xss' && <MissionXSS />}
            {activeMission === 'sqli' && <MissionSQLi />}
          </>
        )}
      </div>
    </div>
  );
};

export default MissionControl;
