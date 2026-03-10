import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { AgentVisualCard } from './AgentVisualCard';

type View = 'dashboard' | 'agents';

export function AgentArena() {
  const [view, setView] = useState<View>('agents');
  const { agents, connected, refresh } = useAgents();

  return (
    <div className="agent-arena">
      <div className="arena-header">
        <div className="arena-tabs">
          <button 
            className={`arena-tab ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`arena-tab ${view === 'agents' ? 'active' : ''}`}
            onClick={() => setView('agents')}
          >
            👥 Agent Arena
          </button>
        </div>
        
        <div className="arena-status">
          <span className={`connection-dot ${connected ? 'online' : 'offline'}`} />
          <span className="connection-text">{connected ? 'Connected' : 'Disconnected'}</span>
          <button onClick={refresh} className="refresh-btn" title="Refresh">
            🔄
          </button>
        </div>
      </div>

      {view === 'agents' ? (
        <div className="agent-visual-grid">
          {agents.map(agent => (
            <AgentVisualCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : null}
    </div>
  );
}