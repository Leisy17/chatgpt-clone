import { useState } from 'react';
import '../../styles/styles.css'; // Adjust the import path if needed

interface ChatInputProps {
  onSend: (message: string) => Promise<void>; // Ensure onSend returns a Promise
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setLoading(true); // Set loading state
      setError(null); // Reset error state
      try {
        await onSend(input);
        setInput(''); // Clear input after sending
      } catch (err) {
        setError('Failed to send message'); // Set error message
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" style={{ display: 'none' }}>
        Type your message
      </label>
      <input
        id="chat-input" // Associate label with input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a new message"
        aria-label="Chat message input" // Add aria-label for accessibility
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'} {/* Button text changes based on loading state */}
      </button>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
    </form>
  );
};

export default ChatInput;
