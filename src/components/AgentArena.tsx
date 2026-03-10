import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { AgentVisualCard } from './AgentVisualCard';

export function AgentArena() {
  const { agents, connected, refresh } = useAgents();

  return (
    <div className="agent-arena">
      <div className="agent-visual-grid">
        {agents.map(agent => (
          <AgentVisualCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}