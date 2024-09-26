'use client'; // Ensure it's a client component

import { useEffect, useState } from 'react';
import '../../styles/Components.css'; // Adjust the import path if needed

type Message = {
  id: string;
  original_message: string;
  edited_message: string | null;
};

interface MessageListProps {
  messages: Message[]; // Accept messages as a prop
  onEdit: (id: string, edited_message: string) => Promise<void>; // Accept onEdit function as a prop
  conversationId: string | null; // Accept conversationId as a prop
}

const MessageList: React.FC<MessageListProps> = ({ messages, onEdit, conversationId }) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Handle edit action
  const handleEditClick = (messageId: string, currentMessage: string) => {
    setEditingMessageId(messageId);
    setEditedMessage(currentMessage); // Set the current message in the input field
  };

  // Handle save (update the edited message)
  const handleSave = async (messageId: string) => {
    try {
      await onEdit(messageId, editedMessage); // Call the onEdit function from props
      setEditingMessageId(null); // Exit edit mode after saving
    } catch (error) {
      setError('Failed to save the message.'); // Handle any errors
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <ul className="message-list">
      {messages.map((message) => (
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
              <button onClick={() => handleEditClick(message.id, message.edited_message || message.original_message)}>
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
