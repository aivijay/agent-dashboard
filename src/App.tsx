import { useAgents } from './hooks/useAgents';
import { useActivity } from './hooks/useActivity';
import { useCommunications } from './hooks/useCommunications';
import { Header } from './components/Header';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './hooks/useActivity';
import { CommunicationTimeline } from './hooks/useCommunications';

export default function App() {
  const { agents, connected, lastRefresh, refresh } = useAgents();
  const { events } = useActivity();
  const { communications } = useCommunications();

  return (
    <div className="app">
      <Header 
        connected={connected} 
        lastRefresh={lastRefresh} 
        onRefresh={refresh} 
      />
      
      <main className="main-content">
        <AgentGrid agents={agents} />
        
        <div className="feeds-container">
          <ActivityFeed events={events} />
          <CommunicationTimeline communications={communications} />
        </div>
      </main>

      <footer className="footer">
        <p>Squad Vision — Agent Dashboard v1.0</p>
      </footer>
    </div>
  );
}
