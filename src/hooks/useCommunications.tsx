import { useState, useEffect } from 'react';
import { listCommunications, Communication } from '../services/api';

export interface CommWithTime extends Communication {
  timeAgo: string;
  formattedTime: string;
}

export function useCommunications() {
  const [communications, setCommunications] = useState<CommWithTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchCommunications() {
      try {
        setLoading(true);
        setError(null);
        const data = await listCommunications(30);
        
        // Format timestamps
        const formatted: CommWithTime[] = data.communications.map(comm => {
          const ts = typeof comm.timestamp === 'string' ? new Date(comm.timestamp).getTime() : comm.timestamp;
          return {
            ...comm,
            timestamp: ts,
            timeAgo: formatTimeAgo(ts),
            formattedTime: formatTime(ts)
          };
        });
        
        setCommunications(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load communications');
      } finally {
        setLoading(false);
      }
    }

    fetchCommunications();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchCommunications, 10000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  // Function to add new communication (for manual additions)
  const addCommunication = (comm: Communication) => {
    const now = Date.now();
    const ts = typeof comm.timestamp === 'string' ? new Date(comm.timestamp).getTime() : (comm.timestamp || now);
    const newComm: CommWithTime = {
      ...comm,
      timestamp: ts,
      timeAgo: formatTimeAgo(ts),
      formattedTime: formatTime(ts)
    };
    setCommunications(prev => [newComm, ...prev].slice(0, 30));
  };

  return { communications, loading, error, refresh, addCommunication };
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

interface CommunicationTimelineProps {
  communications: CommWithTime[];
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
                {comm.formattedTime}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
