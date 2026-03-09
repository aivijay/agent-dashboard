import { useState } from 'react';
import { Agent } from '../types';
import { useToast } from '../hooks/useToast';

interface QuickActionsProps {
  agents: Agent[];
  onSendMessage: (agent: Agent, message: string) => void;
}

export function QuickActions({ agents, onSendMessage }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'command' | 'chat'>('command');
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSend = () => {
    if (!message.trim() || !selectedAgent) return;

    // Send message
    onSendMessage(selectedAgent, message);

    // Show toast
    addToast({
      message: `Message sent to ${selectedAgent.name}`,
      type: 'success',
      from: { name: 'You', emoji: '👤' }
    });

    setSent(true);
    setTimeout(() => {
      if (mode === 'command') {
        setIsOpen(false);
        setSelectedAgent(null);
        setMessage('');
        setSent(false);
      } else {
        setMessage('');
        setSent(false);
      }
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
              {sent && mode === 'command' ? (
                <div className="sent-confirmation">
                  <span className="sent-emoji">✅</span>
                  <p>Message sent to {selectedAgent?.name}!</p>
                </div>
              ) : (
                <>
                  {/* Mode Toggle */}
                  <div className="mode-toggle">
                    <button
                      className={`mode-btn ${mode === 'command' ? 'active' : ''}`}
                      onClick={() => setMode('command')}
                    >
                      ⚡ Quick Command
                    </button>
                    <button
                      className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
                      onClick={() => setMode('chat')}
                    >
                      💬 Start Chat
                    </button>
                  </div>

                  <p className="modal-prompt">
                    {mode === 'command' 
                      ? 'Send a quick command to an agent:' 
                      : 'Start a conversation with an agent:'}
                  </p>
                  
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
                    placeholder={mode === 'command' 
                      ? 'Type your command...' 
                      : 'Type your message...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={mode === 'chat' ? 6 : 4}
                  />

                  <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!selectedAgent || !message.trim()}
                  >
                    {mode === 'command' ? 'Send Command' : 'Start Chat'}
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
