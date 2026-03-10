import { formatTimestamp } from '../utils/formatters';

type View = 'dashboard' | 'arena';

interface HeaderProps {
  connected: boolean;
  lastRefresh: Date;
  onRefresh: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Header({ connected, lastRefresh, onRefresh, currentView, onViewChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          <span className="header-icon">🎯</span>
          Squad Vision
        </h1>
        
        <nav className="header-nav">
          <button 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${currentView === 'arena' ? 'active' : ''}`}
            onClick={() => onViewChange('arena')}
          >
            👥 Agent Arena
          </button>
        </nav>
      </div>
      
      <div className="header-right">
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          <span className="connection-dot" />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
        
        <div className="last-refresh">
          Updated: {formatTimestamp(lastRefresh.getTime())}
        </div>
        
        <button className="refresh-btn" onClick={onRefresh} title="Refresh">
          🔄
        </button>
      </div>
    </header>
  );
}