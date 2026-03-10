import { AgentSession, GatewayStatus } from '../types';

// Use proxy for local dev, direct for production
const API_BASE = import.meta.env.PROD 
  ? 'http://localhost:18790' 
  : '/agent-api';

export async function checkGatewayHealth(): Promise<GatewayStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch {
    return { ok: false, status: 'error' };
  }
}

export async function listSessions(): Promise<{ sessions: AgentSession[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return await res.json();
  } catch (e) {
    console.error('Error fetching sessions:', e);
    return { sessions: [] };
  }
}

export async function listAgents(): Promise<{
  requester: string;
  allowAny: boolean;
  agents: Array<{ id: string; configured: boolean }>;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/agents`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return await res.json();
  } catch (e) {
    console.error('Error fetching agents:', e);
    return { requester: '', allowAny: false, agents: [] };
  }
}

export interface AgentDetail {
  id: string;
  name: string;
  emoji: string;
  role: string;
  hasSessions: boolean;
  lastSessionAt: number | null;
  lastActivityAt: number | null;
  status: 'active' | 'idle' | 'offline';
}

export async function listAgentsDetail(): Promise<{ agents: AgentDetail[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/agents/detail`);
    if (!res.ok) throw new Error('Failed to fetch agent details');
    return await res.json();
  } catch (e) {
    console.error('Error fetching agent details:', e);
    return { agents: [] };
  }
}

export interface Communication {
  id: string;
  timestamp: string | number;
  from: {
    id: string;
    name: string;
    emoji: string;
  };
  to: {
    id: string;
    name: string;
    emoji: string;
  };
  message: string;
  role?: 'user' | 'assistant';
}

export async function listCommunications(limit = 30): Promise<{ communications: Communication[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/communications?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch communications');
    return await res.json();
  } catch (e) {
    console.error('Error fetching communications:', e);
    return { communications: [] };
  }
}
