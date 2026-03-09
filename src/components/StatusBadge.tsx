import { AgentStatus } from '../types';

interface StatusBadgeProps {
  status: AgentStatus;
}

const statusConfig: Record<AgentStatus, { color: string; label: string }> = {
  online: { color: '#06d6a0', label: 'Online' },
  working: { color: '#ffd166', label: 'Working' },
  idle: { color: '#6c757d', label: 'Idle' },
  offline: { color: '#6c757d', label: 'Offline' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span 
      className="status-badge"
      style={{ 
        '--status-color': config.color,
      } as React.CSSProperties}
    >
      <span className={`status-dot ${status === 'working' ? 'pulse' : ''}`} />
      <span className="status-label">{config.label}</span>
    </span>
  );
}
