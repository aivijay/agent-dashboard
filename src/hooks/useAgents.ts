import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentStatus } from '../types';
import { checkGatewayHealth } from '../services/api';
import { timeAgo } from '../utils/formatters';

const AGENT_CONFIG: Record<string, { name: string; emoji: string; role: string; accentColor: string }> = {
  main: { name: 'Plop', emoji: '👋', role: 'Main Assistant', accentColor: '#4cc9f0' },
  clawe: { name: 'Clawe', emoji: '🦞', role: 'Squad Lead', accentColor: '#f72585' },
  inky: { name: 'Inky', emoji: '✍️', role: 'Content Writer', accentColor: '#4361ee' },
  pixel: { name: 'Pixel', emoji: '🎨', role: 'Graphic Designer', accentColor: '#f8961e' },
  scout: { name: 'Scout', emoji: '🔍', role: 'SEO Specialist', accentColor: '#90be6d' },
  buddy: { name: 'Buddy', emoji: '🐐', role: 'Team Mascot', accentColor: '#06d6a0' },
};

// Real session data - these would come from Gateway API in production
// For now, we simulate based on realistic agent behavior
const getAgentActivity = (agentId: string): { status: AgentStatus; task: string } => {
  const tasks: Record<string, { idle: string; working: string[] }> = {
    main: {
      idle: 'Ready to help',
      working: [
        'Processing your request...',
        'Researching information...',
        'Working on code...',
        'Reading files...',
      ]
    },
    clawe: {
      idle: 'Coordinating the team',
      working: [
        'Reviewing task assignments...',
        'Checking team progress...',
        'Planning next steps...',
        'Delegating work...',
      ]
    },
    inky: {
      idle: 'Ready to write',
      working: [
        'Drafting blog post...',
        'Writing product copy...',
        'Editing documentation...',
        'Creating content outline...',
      ]
    },
    pixel: {
      idle: 'Ready to design',
      working: [
        'Generating hero image...',
        'Designing graphics...',
        'Creating diagram...',
        'Editing visual assets...',
      ]
    },
    scout: {
      idle: 'Researching keywords',
      working: [
        'Analyzing search trends...',
        'Checking keyword rankings...',
        'Researching competitors...',
        'Optimizing content...',
      ]
    },
    buddy: {
      idle: 'Exploring around! 🐐',
      working: [
        'Found something interesting!',
        'Checking the workspace...',
        'Looking for adventures!',
        'Making new discoveries!',
      ]
    },
  };

  const config = tasks[agentId] || tasks.main;
  const isWorking = Math.random() > 0.6; // 40% chance of working
  
  return {
    status: isWorking ? 'working' : 'idle',
    task: isWorking 
      ? config.working[Math.floor(Math.random() * config.working.length)]
      : config.idle
  };
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

    // Gateway connected - show agents with realistic status
    const agentList: Agent[] = Object.entries(AGENT_CONFIG).map(([id, config]) => {
      const activity = getAgentActivity(id);
      
      return {
        id,
        ...config,
        status: activity.status,
        currentTask: activity.task,
        lastActivity: activity.status === 'working' ? 'Just now' : timeAgo(Date.now() - Math.random() * 300000),
      };
    });

    setAgents(agentList);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    fetchAgents();
    // Refresh more frequently to show activity changes
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return { agents, connected, lastRefresh, refresh: fetchAgents };
}
