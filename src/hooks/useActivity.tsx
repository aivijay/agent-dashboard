import { useState, useEffect, useRef } from 'react';
import { ActivityEvent } from '../types';

const AGENT_EMOJI: Record<string, string> = {
  main: '👋',
  clawe: '🦞',
  inky: '✍️',
  pixel: '🎨',
  scout: '🔍',
  buddy: '🐐',
};

// Sample activity for demo - in production, this would come from Gateway events
const generateSampleActivity = (): ActivityEvent[] => [
  {
    id: '1',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    agentId: 'clawe',
    agentEmoji: '🦞',
    message: 'Assigned task to Inky: Write blog post intro',
    type: 'task',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    agentId: 'scout',
    agentEmoji: '🔍',
    message: 'Researching keywords for "goat care"',
    type: 'task',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    agentId: 'pixel',
    agentEmoji: '🎨',
    message: 'Generating hero image for blog post',
    type: 'task',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    agentId: 'buddy',
    agentEmoji: '🐐',
    message: 'Checking in on the team! 💚',
    type: 'status',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    agentId: 'inky',
    agentEmoji: '✍️',
    message: 'Completed: Product description for farm store',
    type: 'task',
  },
];

export function useActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load initial sample data
    setEvents(generateSampleActivity());
    setIsConnected(true);

    // In production, this would connect to a real-time event source
    // For now, we'll just update with some variety occasionally
    const interval = setInterval(() => {
      const activityTypes = [
        { message: 'Working on content draft', agent: ['inky', 'scout', 'pixel'][Math.floor(Math.random() * 3)] },
        { message: 'Reviewing team progress', agent: 'clawe' },
        { message: 'Exploring new ideas! 🐐', agent: 'buddy' },
      ];
      const random = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const newEvent: ActivityEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        agentId: random.agent,
        agentEmoji: AGENT_EMOJI[random.agent],
        message: random.message,
        type: 'task',
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return { events, isConnected };
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h2 className="activity-title">📡 Activity Feed</h2>
        <span className="activity-count">{events.length} events</span>
      </div>
      
      <div className="activity-list" ref={containerRef}>
        {events.length === 0 ? (
          <div className="activity-empty">No activity yet</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="activity-item">
              <span className="activity-emoji">{event.agentEmoji}</span>
              <div className="activity-content">
                <span className="activity-message">{event.message}</span>
                <span className="activity-time">
                  {new Date(event.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
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
