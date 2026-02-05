import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ContainerList from './components/ContainerList';
import ContainerDetail from './components/ContainerDetail';
import ContainerStats from './components/ContainerStats';
import EventStream from './components/EventStream';
import HostList from './components/HostList';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './contexts/AuthContext';

type View = 'containers' | 'stats' | 'events' | 'hosts' | 'detail';
type AuthView = 'login' | 'register';

function App() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('containers');
  const [showDetail, setShowDetail] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="content-wrapper">
          <nav className="sidebar">
            <button
              className={`nav-item ${currentView === 'containers' ? 'active' : ''}`}
              onClick={() => setCurrentView('containers')}
            >
              <span className="nav-icon">📦</span>
              Containers
            </button>
            <button
              className={`nav-item ${currentView === 'stats' ? 'active' : ''}`}
              onClick={() => setCurrentView('stats')}
            >
              <span className="nav-icon">📊</span>
              Resource
            </button>
            <button
              className={`nav-item ${currentView === 'events' ? 'active' : ''}`}
              onClick={() => setCurrentView('events')}
            >
              <span className="nav-icon">📝</span>
              Events
            </button>
            <button
              className={`nav-item ${currentView === 'hosts' ? 'active' : ''}`}
              onClick={() => setCurrentView('hosts')}
            >
              <span className="nav-icon">🖥️</span>
              Hosts
            </button>
            <div className="nav-divider"></div>
            <button
              className={`nav-item ${showDetail ? 'active' : ''}`}
              onClick={() => setShowDetail(!showDetail)}
            >
              <span className="nav-icon">🔍</span>
              Detail View
            </button>
          </nav>

          <div className="content-area">
            {currentView === 'containers' && <ContainerList />}
            {currentView === 'stats' && <ContainerStats />}
            {currentView === 'events' && <EventStream />}
            {currentView === 'hosts' && <HostList />}

            {showDetail && (
              <div className="detail-panel">
                <ContainerDetail />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
