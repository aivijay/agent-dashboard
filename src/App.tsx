import { useAgents } from './hooks/useAgents';
import { useActivity } from './hooks/useActivity';
import { Header } from './components/Header';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './hooks/useActivity';

export default function App() {
  const { agents, connected, lastRefresh, refresh } = useAgents();
  const { events } = useActivity();

  return (
    <div className="app">
      <Header 
        connected={connected} 
        lastRefresh={lastRefresh} 
        onRefresh={refresh} 
      />
      
      <main className="main-content">
        <AgentGrid agents={agents} />
        <ActivityFeed events={events} />
      </main>

      <footer className="footer">
        <p>Squad Vision — Agent Dashboard v1.0</p>
      </footer>
    </div>
  );
}
