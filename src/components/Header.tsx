import './Header.css';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Container Manager</h1>
        <div className="header-right">
          {user && (
            <span className="user-info">
              {user.username}
            </span>
          )}
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
