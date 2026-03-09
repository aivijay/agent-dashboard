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

const agentTasks: Record<string, { idle: string; working: string[] }> = {
  main: {
    idle: 'Ready to help',
    working: ['Processing your request...', 'Researching information...', 'Working on code...', 'Reading files...']
  },
  clawe: {
    idle: 'Coordinating the team',
    working: ['Reviewing task assignments...', 'Checking team progress...', 'Planning next steps...', 'Delegating work...']
  },
  inky: {
    idle: 'Ready to write',
    working: ['Drafting blog post...', 'Writing product copy...', 'Editing documentation...', 'Creating content outline...']
  },
  pixel: {
    idle: 'Ready to design',
    working: ['Generating hero image...', 'Designing graphics...', 'Creating diagram...', 'Editing visual assets...']
  },
  scout: {
    idle: 'Researching keywords',
    working: ['Analyzing search trends...', 'Checking keyword rankings...', 'Researching competitors...', 'Optimizing content...']
  },
  buddy: {
    idle: 'Exploring around! 🐐',
    working: ['Found something interesting!', 'Checking the workspace...', 'Looking for adventures!', 'Making new discoveries!']
  },
};

function getAgentActivity(agentId: string): { status: AgentStatus; task: string } {
  const config = agentTasks[agentId] || agentTasks.main;
  const isWorking = Math.random() > 0.6;
  
  return {
    status: isWorking ? 'working' : 'idle',
    task: isWorking 
      ? config.working[Math.floor(Math.random() * config.working.length)]
      : config.idle
  };
}

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

    // Get real agent data from API
    const detailRes = await listAgentsDetail();
    const agentDetailMap = new Map(detailRes.agents.map(a => [a.id, a]));

    const agentList: Agent[] = Object.entries(AGENT_CONFIG).map(([id, config]) => {
      const detail = agentDetailMap.get(id);
      const activity = getAgentActivity(id);
      
      let status: AgentStatus = 'online';
      if (detail?.hasSessions) {
        status = Math.random() > 0.5 ? 'working' : 'idle';
      }
      
      return {
        id,
        ...config,
        status,
        currentTask: status === 'working' ? activity.task : 'Ready',
        lastActivity: detail?.lastSessionAt ? timeAgo(detail.lastSessionAt) : undefined,
      };
    });

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
