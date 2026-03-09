import { useState, useEffect } from 'react';
import { ActivityEvent } from '../types';

const AGENT_EMOJI: Record<string, string> = {
  main: '👋',
  clawe: '🦞',
  inky: '✍️',
  pixel: '🎨',
  scout: '🔍',
  buddy: '🐐',
};

// Realistic activity templates
const activityTemplates = [
  // Clawe (squad lead)
  { message: 'Reviewing team progress', agent: 'clawe', type: 'status' as const },
  { message: 'Assigning task to Inky', agent: 'clawe', type: 'task' as const },
  { message: 'Checking in on the team 🦞', agent: 'clawe', type: 'status' as const },
  { message: 'Coordinating with Scout on keywords', agent: 'clawe', type: 'communication' as const },
  
  // Inky (content writer)
  { message: 'Writing blog post draft', agent: 'inky', type: 'task' as const },
  { message: 'Editing product descriptions', agent: 'inky', type: 'task' as const },
  { message: 'Creating documentation outline', agent: 'inky', type: 'task' as const },
  { message: 'Polishing copy for farm store', agent: 'inky', type: 'task' as const },
  
  // Pixel (designer)
  { message: 'Designing hero image', agent: 'pixel', type: 'task' as const },
  { message: 'Creating social media graphics', agent: 'pixel', type: 'task' as const },
  { message: 'Working on logo concepts', agent: 'pixel', type: 'task' as const },
  { message: 'Generating diagrams for blog', agent: 'pixel', type: 'task' as const },
  
  // Scout (SEO)
  { message: 'Researching keywords', agent: 'scout', type: 'task' as const },
  { message: 'Analyzing search trends', agent: 'scout', type: 'task' as const },
  { message: 'Optimizing meta descriptions', agent: 'scout', type: 'task' as const },
  { message: 'Checking competitor rankings', agent: 'scout', type: 'task' as const },
  
  // Buddy (mascot)
  { message: 'Exploring the workspace! 🐐', agent: 'buddy', type: 'status' as const },
  { message: 'Checking on everyone 💚', agent: 'buddy', type: 'status' as const },
  { message: 'Found something interesting!', agent: 'buddy', type: 'status' as const },
  { message: 'Taking a break to eat hay 🌾', agent: 'buddy', type: 'status' as const },
];

const generateActivity = (): ActivityEvent => {
  const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    agentId: template.agent,
    agentEmoji: AGENT_EMOJI[template.agent],
    message: template.message,
    type: template.type,
  };
};

const initialActivity: ActivityEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    agentId: 'clawe',
    agentEmoji: '🦞',
    message: 'Good morning team! Ready to tackle today\'s tasks 🦞',
    type: 'status',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    agentId: 'scout',
    agentEmoji: '🔍',
    message: 'Researching trending keywords for farm content',
    type: 'task',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    agentId: 'inky',
    agentEmoji: '✍️',
    message: 'Started drafting new blog post',
    type: 'task',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    agentId: 'pixel',
    agentEmoji: '🎨',
    message: 'Creating visuals for the new blog post',
    type: 'task',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    agentId: 'buddy',
    agentEmoji: '🐐',
    message: 'Hey everyone! Checking in! 💚',
    type: 'status',
  },
];

export function useActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>(initialActivity);

  useEffect(() => {
    // Add new activity every 10-20 seconds
    const addActivity = () => {
      const newEvent = generateActivity();
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    };

    const interval = setInterval(() => {
      addActivity();
    }, 10000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  return { events };
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h2 className="activity-title">📡 Activity Feed</h2>
        <span className="activity-count">{events.length} events</span>
      </div>
      
      <div className="activity-list">
        {events.length === 0 ? (
          <div className="activity-empty">No activity yet</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`activity-item activity-${event.type}`}>
              <span className="activity-emoji">{event.agentEmoji}</span>
              <div className="activity-content">
                <span className="activity-message">{event.message}</span>
                <span className="activity-time">
                  {new Date(event.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
