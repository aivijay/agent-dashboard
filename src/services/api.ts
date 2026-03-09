import { AgentSession, GatewayStatus } from '../types';

// Use relative paths - Vite proxy will forward to Gateway
const GATEWAY_BASE = '';

export async function checkGatewayHealth(): Promise<GatewayStatus> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/health`);
    return await res.json();
  } catch {
    return { ok: false, status: 'error' };
  }
}

export async function listSessions(): Promise<{ sessions: AgentSession[] }> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/api/sessions`);
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
    const res = await fetch(`${GATEWAY_BASE}/api/agents`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return await res.json();
  } catch (e) {
    console.error('Error fetching agents:', e);
    return { requester: '', allowAny: false, agents: [] };
  }
}
