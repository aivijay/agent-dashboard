import { useAgents } from './hooks/useAgents';
import { useActivity } from './hooks/useActivity';
import { useCommunications } from './hooks/useCommunications';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './hooks/useActivity';
import { CommunicationTimeline } from './hooks/useCommunications';
import { QuickActions } from './components/QuickActions';
import { ToastContainer } from './hooks/useToast';
import { Agent, Communication } from './types';

export default function App() {
  const { agents, connected, lastRefresh, refresh } = useAgents();
  const { events } = useActivity();
  const { communications, addCommunication } = useCommunications();
  const { toasts, addToast, removeToast } = useToast();

  const handleSendMessage = (agent: Agent, message: string) => {
    // Add the outgoing message to communication feed
    const newComm: Communication = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      from: { id: 'vijay', name: 'Vijay', emoji: '👤' },
      to: { id: agent.id, name: agent.name, emoji: agent.emoji },
      message: message,
    };
    addCommunication(newComm);

    // Simulate agent response after a short delay
    setTimeout(() => {
      const responses = [
        "Got it! I'll work on that right away. 🦞",
        "Thanks! I'll take care of it. ✍️",
        "On it! Let me check and get back to you. 🔍",
        "Nice! I'll handle this. 🎨",
        "Thanks for the task! I'll get started. 🐐",
        "Sounds good! I'll make it happen. 👋",
      ];
      const responseMsg = responses[Math.floor(Math.random() * responses.length)];
      
      const responseComm: Communication = {
        id: (Date.now() + 1).toString(),
        timestamp: Date.now(),
        from: { id: agent.id, name: agent.name, emoji: agent.emoji },
        to: { id: 'vijay', name: 'Vijay', emoji: '👤' },
        message: responseMsg,
      };
      addCommunication(responseComm);

      // Show toast for response
      addToast({
        message: responseMsg,
        type: 'info',
        from: { name: agent.name, emoji: agent.emoji }
      });
    }, 1500 + Math.random() * 2000);
  };

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

      <QuickActions agents={agents} onSendMessage={handleSendMessage} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <footer className="footer">
        <p>Squad Vision — Agent Dashboard v1.0</p>
      </footer>
    </div>
  );
}
