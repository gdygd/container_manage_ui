import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Container Monitor</h1>
        <nav className="header-nav">
          <button className="nav-button active">Containers</button>
          <button className="nav-button">Stats</button>
          <button className="nav-button">Events</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
