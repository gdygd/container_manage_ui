import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks';

function Header() {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Container Manager</h1>
        <div className="header-right">
          {user && (
            <span className="user-info">{user.username}</span>
          )}
          <button className="logout-btn" onClick={() => logout()} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MainLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <nav className="sidebar">
            <NavLink
              to="/containers"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">📦</span>
              Containers
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Resource
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">📝</span>
              Events
            </NavLink>
            <NavLink
              to="/hosts"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">🖥️</span>
              Hosts
            </NavLink>
          </nav>
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
