import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentStatus } from '../types';
import { checkGatewayHealth, listAgentsDetail } from '../services/api';

const AGENT_CONFIG: Record<string, { name: string; emoji: string; role: string; accentColor: string }> = {
  main: { name: 'Plop', emoji: '👋', role: 'Main Assistant', accentColor: '#4cc9f0' },
  clawe: { name: 'Clawe', emoji: '🦞', role: 'Squad Lead', accentColor: '#f72585' },
  inky: { name: 'Inky', emoji: '✍️', role: 'Content Writer', accentColor: '#4361ee' },
  pixel: { name: 'Pixel', emoji: '🎨', role: 'Graphic Designer', accentColor: '#f8961e' },
  scout: { name: 'Scout', emoji: '🔍', role: 'SEO Specialist', accentColor: '#90be6d' },
  buddy: { name: 'Buddy', emoji: '🐐', role: 'Team Mascot', accentColor: '#06d6a0' },
};

// Demo data when API is not available
const DEMO_MODE = false; // Set to true for demo mode, false for real API

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAgents = useCallback(async () => {
    // In demo mode, skip API calls and use simulated data
    if (DEMO_MODE) {
      const agentList: Agent[] = Object.entries(AGENT_CONFIG).map(([id, config]) => ({
        id,
        ...config,
        status: Math.random() > 0.5 ? 'working' : 'idle' as AgentStatus,
        currentTask: 'Ready',
        lastActivity: 'Just now',
      }));
      setAgents(agentList);
      setConnected(true);
      setLastRefresh(new Date());
      return;
    }

    // Real API mode
    const health = await checkGatewayHealth();
    setConnected(health.ok);

    if (!health.ok) {
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

    try {
      const detailRes = await listAgentsDetail();
      const detailMap = new Map(detailRes.agents.map(a => [a.id, a]));

      const agentList: Agent[] = Object.entries(AGENT_CONFIG).map(([id, config]) => {
        const detail = detailMap.get(id);
        
        // API returns: 'active', 'idle', or 'offline'
        // Map to frontend status: 'working' (active), 'idle', 'offline'
        let status: AgentStatus = 'offline';
        if (detail) {
          if (detail.status === 'active') {
            status = 'working';
          } else if (detail.status === 'idle') {
            status = 'idle';
          } else {
            status = 'offline';
          }
        }
        
        // Get current task based on status
        let currentTask: string | undefined;
        if (status === 'working') {
          currentTask = 'Active session';
        } else if (status === 'idle') {
          currentTask = 'Ready';
        }
        
        return {
          id,
          ...config,
          status,
          currentTask,
          lastActivity: detail?.lastActivityAt ? timeAgo(detail.lastActivityAt) : (detail?.lastSessionAt ? timeAgo(detail.lastSessionAt) : undefined),
        };
      });

      setAgents(agentList);
    } catch (e) {
      console.error('Error fetching agents:', e);
      const offlineAgents = Object.entries(AGENT_CONFIG).map(([id, config]) => ({
        id,
        ...config,
        status: 'offline' as AgentStatus,
        currentTask: undefined,
        lastActivity: undefined,
      }));
      setAgents(offlineAgents);
    }

    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    fetchAgents();
    // Refresh every 10 seconds for real status updates
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return { agents, connected, lastRefresh, refresh: fetchAgents };
}
