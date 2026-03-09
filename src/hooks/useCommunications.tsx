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

// Communication templates based on agent relationships
const communicationTemplates = [
  // Clawe (squad lead) communicating with team
  { from: 'clawe', to: 'inky', message: 'Hey Inky, can you write the intro for our new blog post?' },
  { from: 'clawe', to: 'pixel', message: 'We need a hero image for the blog. Can you create something with goats?' },
  { from: 'clawe', to: 'scout', message: 'Scout, what keywords are trending for farm content?' },
  { from: 'clawe', to: 'buddy', message: 'Hey Buddy! How about you check the workspace and let us know what you find?' },
  
  // Team responses to Clawe
  { from: 'inky', to: 'clawe', message: 'Sure thing! I\'ll have a draft ready in a bit.' },
  { from: 'pixel', to: 'clawe', message: 'On it! I\'ll make something warm and inviting. Farm vibes 🌾' },
  { from: 'scout', to: 'clawe', message: 'Found some good keywords for the farm store page. Sending them over now.' },
  { from: 'buddy', to: 'clawe', message: 'Hi Clawe! Is there anything I can help with? I\'m ready to explore! 🐐' },
  
  // Buddy being Buddy
  { from: 'buddy', to: 'scout', message: 'Scout! Look what I found! It smells interesting! 🐐' },
  { from: 'buddy', to: 'inky', message: 'Inky! Are you writing something cool? Can I help? 🐐' },
  { from: 'buddy', to: 'pixel', message: 'Pixel! I found some pretty colors! Maybe for a picture?' },
  
  // Scout working with team
  { from: 'scout', to: 'inky', message: 'Inky, I found great keywords for your article. Check them out!' },
  { from: 'scout', to: 'pixel', message: 'Hey Pixel, make sure to add alt text with keywords to your images!' },
  
  // Pixel collaborating
  { from: 'pixel', to: 'inky', message: 'Hey Inky, the blog post is ready. Let me know when you want the final copy!' },
  { from: 'pixel', to: 'scout', message: 'Scout, I need some keywords for the image I\'m creating!' },
];

const AGENT_INFO: Record<string, { name: string; emoji: string }> = {
  main: { name: 'Plop', emoji: '👋' },
  clawe: { name: 'Clawe', emoji: '🦞' },
  inky: { name: 'Inky', emoji: '✍️' },
  pixel: { name: 'Pixel', emoji: '🎨' },
  scout: { name: 'Scout', emoji: '🔍' },
  buddy: { name: 'Buddy', emoji: '🐐' },
};

// Generate initial communications
const generateInitialCommunications = (): Communication[] => {
  const now = Date.now();
  const shuffled = [...communicationTemplates].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, 6).map((c, i) => ({
    id: `init-${i}`,
    timestamp: new Date(now - i * 90000 - Math.random() * 30000).toISOString(),
    from: { id: c.from, ...AGENT_INFO[c.from] },
    to: { id: c.to, ...AGENT_INFO[c.to] },
    message: c.message,
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function useCommunications() {
  const [communications, setCommunications] = useState<Communication[]>(generateInitialCommunications);

  // Function to add new communication from outside
  const addCommunication = (comm: Communication) => {
    setCommunications(prev => [comm, ...prev].slice(0, 30));
  };

  useEffect(() => {
    // Add new communication occasionally
    const addComm = () => {
      const template = communicationTemplates[Math.floor(Math.random() * communicationTemplates.length)];
      
      const newComm: Communication = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        from: { id: template.from, ...AGENT_INFO[template.from] },
        to: { id: template.to, ...AGENT_INFO[template.to] },
        message: template.message,
      };
      
      setCommunications(prev => [newComm, ...prev].slice(0, 30));
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to add communication
        addComm();
      }
    }, 15000 + Math.random() * 10000);

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
