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

// Activity templates based on agent roles
const activityTemplates = {
  main: [
    { message: 'Processing your request', type: 'task' as const },
    { message: 'Reading and analyzing files', type: 'task' as const },
    { message: 'Running a command', type: 'task' as const },
    { message: 'Researching information', type: 'task' as const },
    { message: 'Ready to help!', type: 'status' as const },
  ],
  clawe: [
    { message: 'Reviewing team progress', type: 'status' as const },
    { message: 'Assigning tasks to specialists', type: 'communication' as const },
    { message: 'Coordinating with the team', type: 'task' as const },
    { message: 'Planning next steps', type: 'task' as const },
    { message: 'Checking in on everyone 🦞', type: 'status' as const },
  ],
  inky: [
    { message: 'Writing a blog post', type: 'task' as const },
    { message: 'Drafting product descriptions', type: 'task' as const },
    { message: 'Creating documentation', type: 'task' as const },
    { message: 'Editing and polishing copy', type: 'task' as const },
    { message: 'Working on content strategy', type: 'task' as const },
  ],
  pixel: [
    { message: 'Designing a hero image', type: 'task' as const },
    { message: 'Creating social graphics', type: 'task' as const },
    { message: 'Generating diagrams', type: 'task' as const },
    { message: 'Editing visual assets', type: 'task' as const },
    { message: 'Working on logo concepts', type: 'task' as const },
  ],
  scout: [
    { message: 'Researching keywords', type: 'task' as const },
    { message: 'Analyzing search trends', type: 'task' as const },
    { message: 'Checking competitor rankings', type: 'task' as const },
    { message: 'Optimizing meta descriptions', type: 'task' as const },
    { message: 'SEO audit in progress', type: 'task' as const },
  ],
  buddy: [
    { message: 'Exploring the workspace! 🐐', type: 'status' as const },
    { message: 'Found something interesting!', type: 'status' as const },
    { message: 'Checking on the team 💚', type: 'status' as const },
    { message: 'Taking a break to eat hay 🌾', type: 'status' as const },
    { message: 'Having an adventure!', type: 'status' as const },
  ],
};

// Generate initial activities
const generateInitialActivities = (): ActivityEvent[] => {
  const now = Date.now();
  const agents = Object.keys(AGENT_EMOJI);
  
  return agents.map((agentId, index) => {
    const templates = activityTemplates[agentId as keyof typeof activityTemplates] || activityTemplates.main;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: `init-${index}`,
      timestamp: new Date(now - index * 60000 - Math.random() * 30000).toISOString(),
      agentId,
      agentEmoji: AGENT_EMOJI[agentId],
      message: template.message,
      type: template.type,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function useActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>(generateInitialActivities);

  useEffect(() => {
    // Add new activity occasionally (every 8-15 seconds)
    const addActivity = () => {
      const agents = Object.keys(AGENT_EMOJI);
      const agentId = agents[Math.floor(Math.random() * agents.length)];
      const templates = activityTemplates[agentId as keyof typeof activityTemplates] || activityTemplates.main;
      const template = templates[Math.floor(Math.random() * templates.length)];

      const newEvent: ActivityEvent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        agentId,
        agentEmoji: AGENT_EMOJI[agentId],
        message: template.message,
        type: template.type,
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance to add activity
        addActivity();
      }
    }, 8000 + Math.random() * 7000);

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
