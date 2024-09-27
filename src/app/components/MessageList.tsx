'use client';

import { useEffect, useState } from 'react';
import '../../styles/Components.css';

type Message = {
  id: string;
  original_message: string;
  edited_message: string | null;
};

interface MessageListProps {
  messages: Message[];
  onEdit: (id: string, edited_message: string) => Promise<void>;
  conversationId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onEdit, conversationId }) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (messageId: string, currentMessage: string) => {
    setEditingMessageId(messageId);
    setEditedMessage(currentMessage);
  };

  const handleSave = async (messageId: string) => {
    try {
      await onEdit(messageId, editedMessage);
      setEditingMessageId(null);
    } catch (error) {
      setError('Failed to save the message.');
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <ul className="message-list">
      {messages
        .filter((message) => message && message.id)
        .map((message) => (
          <li key={message.id}>
            {editingMessageId === message.id ? (
              <>
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                />
                <button onClick={() => handleSave(message.id)}>Save</button>
                <button onClick={() => setEditingMessageId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>You: {message.edited_message || message.original_message}</p>
                <button
                  onClick={() =>
                    handleEditClick(message.id, message.edited_message || message.original_message)
                  }
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
    </ul>
  );
};

export default MessageList;
