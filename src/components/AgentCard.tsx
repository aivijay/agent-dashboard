import { Agent } from '../types';
import { StatusBadge } from './StatusBadge';
import { truncate } from '../utils/formatters';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div 
      className="agent-card"
      style={{ '--agent-color': agent.accentColor } as React.CSSProperties}
    >
      <div className="agent-avatar">
        <span className="agent-emoji">{agent.emoji}</span>
      </div>
      
      <div className="agent-info">
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-role">{agent.role}</p>
      </div>

      <StatusBadge status={agent.status} />

      <div className="agent-task">
        {agent.currentTask ? (
          <span className="task-text">{truncate(agent.currentTask, 50)}</span>
        ) : (
          <span className="task-empty">No active task</span>
        )}
      </div>

      {agent.lastActivity && (
        <div className="agent-activity">
          Last active: {agent.lastActivity}
        </div>
      )}
    </div>
  );
}
