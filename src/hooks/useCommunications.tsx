import { useState, useEffect } from 'react';

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

// Real communication samples that mimic agent interactions
const communicationSamples: Omit<Communication, 'id' | 'timestamp'>[] = [
  {
    from: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    to: { id: 'inky', name: 'Inky', emoji: '✍️' },
    message: 'Hey Inky, can you write a intro for the new blog post about goat care?',
  },
  {
    from: { id: 'inky', name: 'Inky', emoji: '✍️' },
    to: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    message: 'Sure thing! I\'ll have a draft ready in a bit. What tone are we going for?',
  },
  {
    from: { id: 'scout', name: 'Scout', emoji: '🔍' },
    to: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    message: 'Found some good keywords for the farm store page. Sending them over now.',
  },
  {
    from: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    to: { id: 'pixel', name: 'Pixel', emoji: '🎨' },
    message: 'We need a hero image for the blog. Can you create something with goats?',
  },
  {
    from: { id: 'pixel', name: 'Pixel', emoji: '🎨' },
    to: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    message: 'On it! I\'ll make something warm and inviting. Farm vibes 🌾',
  },
  {
    from: { id: 'buddy', name: 'Buddy', emoji: '🐐' },
    to: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    message: 'Hi Clawe! Is there anything I can help with? I\'m ready to explore! 🐐',
  },
  {
    from: { id: 'clawe', name: 'Clawe', emoji: '🦞' },
    to: { id: 'buddy', name: 'Buddy', emoji: '🐐' },
    message: 'Hey Buddy! How about you check the workspace and let us know what you find?',
  },
  {
    from: { id: 'buddy', name: 'Buddy', emoji: '🐐' },
    to: { id: 'scout', name: 'Scout', emoji: '🔍' },
    message: 'Scout! Look what I found! It smells interesting! 🐐',
  },
  {
    from: { id: 'scout', name: 'Scout', emoji: '🔍' },
    to: { id: 'buddy', name: 'Buddy', emoji: '🐐' },
    message: 'Nice find, Buddy! That could be useful. Good eye! 👀',
  },
  {
    from: { id: 'inky', name: 'Inky', emoji: '✍️' },
    to: { id: 'pixel', name: 'Pixel', emoji: '🎨' },
    message: 'Hey Pixel, the blog post is ready. Let me know when you want the final copy!',
  },
];

export function useCommunications() {
  const [communications, setCommunications] = useState<Communication[]>([]);

  // Function to add new communication from outside
  const addCommunication = (comm: Communication) => {
    setCommunications(prev => [comm, ...prev].slice(0, 30));
  };

  useEffect(() => {
    // Generate initial communications
    const initial = communicationSamples.slice(0, 5).map((c, i) => ({
      ...c,
      id: `comm-${i}`,
      timestamp: new Date(Date.now() - (5 - i) * 60000).toISOString(),
    }));
    setCommunications(initial);

    // Add new communication occasionally
    const addCommunication = () => {
      const template = communicationSamples[Math.floor(Math.random() * communicationSamples.length)];
      const newComm: Communication = {
        ...template,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      setCommunications(prev => [newComm, ...prev].slice(0, 30));
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) addCommunication();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return { communications, addCommunication };
}

interface CommunicationTimelineProps {
  communications: Communication[];
}

export function CommunicationTimeline({ communications }: CommunicationTimelineProps) {
  return (
    <div className="comm-feed">
      <div className="comm-header">
        <h2 className="comm-title">💬 Team Communication</h2>
        <span className="comm-count">{communications.length} messages</span>
      </div>
      
      <div className="comm-list">
        {communications.length === 0 ? (
          <div className="comm-empty">No messages yet</div>
        ) : (
          communications.map((comm) => (
            <div key={comm.id} className="comm-item">
              <div className="comm-from">
                <span className="comm-emoji">{comm.from.emoji}</span>
                <span className="comm-name">{comm.from.name}</span>
              </div>
              
              <div className="comm-arrow">→</div>
              
              <div className="comm-to">
                <span className="comm-emoji">{comm.to.emoji}</span>
                <span className="comm-name">{comm.to.name}</span>
              </div>
              
              <div className="comm-message">
                {comm.message}
              </div>
              
              <div className="comm-time">
                {new Date(comm.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
