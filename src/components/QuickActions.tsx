import { useState } from 'react';
import { Agent } from '../types';

interface QuickActionsProps {
  agents: Agent[];
}

export function QuickActions({ agents }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim() || !selectedAgent) return;
    setSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setSelectedAgent(null);
      setMessage('');
      setSent(false);
    }, 1500);
  };

  return (
    <>
      <button className="quick-actions-btn" onClick={() => setIsOpen(true)}>
        ⚡ Quick Actions
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message an Agent</h2>
              <button className="modal-close" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              {sent ? (
                <div className="sent-confirmation">
                  <span className="sent-emoji">✅</span>
                  <p>Message sent to {selectedAgent?.name}!</p>
                </div>
              ) : (
                <>
                  <p className="modal-prompt">Select an agent and type your message:</p>
                  
                  <div className="agent-select">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        className={`agent-select-btn ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <span className="agent-select-emoji">{agent.emoji}</span>
                        <span className="agent-select-name">{agent.name}</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="message-input"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />

                  <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!selectedAgent || !message.trim()}
                  >
                    Send Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
