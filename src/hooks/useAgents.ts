import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentStatus } from '../types';
import { checkGatewayHealth } from '../services/api';

const AGENT_CONFIG: Record<string, { name: string; emoji: string; role: string; accentColor: string }> = {
  main: { name: 'Plop', emoji: '👋', role: 'Main Assistant', accentColor: '#4cc9f0' },
  clawe: { name: 'Clawe', emoji: '🦞', role: 'Squad Lead', accentColor: '#f72585' },
  inky: { name: 'Inky', emoji: '✍️', role: 'Content Writer', accentColor: '#4361ee' },
  pixel: { name: 'Pixel', emoji: '🎨', role: 'Graphic Designer', accentColor: '#f8961e' },
  scout: { name: 'Scout', emoji: '🔍', role: 'SEO Specialist', accentColor: '#90be6d' },
  buddy: { name: 'Buddy', emoji: '🐐', role: 'Team Mascot', accentColor: '#06d6a0' },
};

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAgents = useCallback(async () => {
    const health = await checkGatewayHealth();
    setConnected(health.ok);

    if (!health.ok) {
      // Gateway offline - show all as offline
      const offlineAgents = Object.entries(AGENT_CONFIG).map(([id, config]) => ({
        id,
        ...config,
        status: 'offline' as AgentStatus,
        currentTask: undefined,
        lastActivity: undefined,
      }));
      setAgents(offlineAgents);
      return;
    }

    // Gateway connected - show all agents as online (configured in openclaw.json)
    const agentList: Agent[] = Object.entries(AGENT_CONFIG).map(([id, config]) => ({
      id,
      ...config,
      status: 'online' as AgentStatus,
      currentTask: 'Ready',
      lastActivity: undefined,
    }));

    setAgents(agentList);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return { agents, connected, lastRefresh, refresh: fetchAgents };
}
