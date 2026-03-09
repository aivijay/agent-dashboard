export type AgentStatus = 'online' | 'working' | 'idle' | 'offline';

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: AgentStatus;
  currentTask?: string;
  lastActivity?: string;
  accentColor: string;
}

export interface AgentSession {
  key: string;
  sessionId: string;
  channel?: string;
  model?: string;
  updatedAt: number;
  abortedLastRun: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentEmoji: string;
  message: string;
  type: 'status' | 'task' | 'communication';
}

export interface GatewayStatus {
  ok: boolean;
  status: string;
}

export interface Communication {
  id: string;
  timestamp: string;
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
}
