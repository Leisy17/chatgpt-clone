import { useState } from 'react';
import '../../styles/Components.css';

interface ChatInputProps {
  onSend: (original_message: string, conversationId: string | null) => Promise<void>;
  conversationId: string | null;
}

const ChatInput = ({ onSend, conversationId }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setLoading(true);
      setError(null);

      try {
        await onSend(input, conversationId);
        setInput('');
      } catch (err) {
        console.error('Error in handleSubmit:', err);
        setError('Failed to send message.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" style={{ display: 'none' }}>
        Type your message
      </label>
      <input
        id="chat-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a new message"
        aria-label="Chat message input"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ChatInput;
