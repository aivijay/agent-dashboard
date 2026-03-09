import { formatTimestamp } from '../utils/formatters';

interface HeaderProps {
  connected: boolean;
  lastRefresh: Date;
  onRefresh: () => void;
}

export function Header({ connected, lastRefresh, onRefresh }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          <span className="header-icon">🎯</span>
          Squad Vision
        </h1>
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
