import { Agent } from '../types';
import './AgentVisualCard.css';

interface AgentVisualCardProps {
  agent: Agent;
}

export function AgentVisualCard({ agent }: AgentVisualCardProps) {
  const statusConfig = {
    working: {
      label: 'Working',
      color: '#10b981', // emerald
      animation: 'typing',
      icon: '💻'
    },
    idle: {
      label: 'Ready',
      color: '#f59e0b', // amber
      animation: 'idle',
      icon: '😴'
    },
    offline: {
      label: 'Offline',
      color: '#6b7280', // gray
      animation: 'none',
      icon: '📴'
    },
    online: {
      label: 'Online',
      color: '#3b82f6', // blue
      animation: 'pulse',
      icon: '🟢'
    }
  };

  const config = statusConfig[agent.status] || statusConfig.offline;

  return (
    <div className={`agent-visual-card status-${agent.status}`}>
      <div className="avatar-container">
        <div className={`avatar ${config.animation}`}>
          <span className="avatar-emoji">{agent.emoji}</span>
        </div>
        <div 
          className="status-indicator" 
          style={{ backgroundColor: config.color }}
          title={config.label}
        />
      </div>

      <div className="agent-info">
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-role">{agent.role}</p>
        
        <div className="agent-status">
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: `${config.color}20`,
              color: config.color,
              borderColor: config.color
            }}
          >
            {config.icon} {config.label}
          </span>
        </div>

        {agent.currentTask && (
          <div className="agent-task">
            <span className="task-label">Current:</span>
            <span className="task-text">{agent.currentTask}</span>
          </div>
        )}

        {agent.lastActivity && (
          <div className="agent-activity">
            <span className="activity-label">Last:</span>
            <span className="activity-time">{agent.lastActivity}</span>
          </div>
        )}
      </div>

      {agent.status === 'working' && (
        <div className="working-indicator">
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
        </div>
      )}
    </div>
  );
}