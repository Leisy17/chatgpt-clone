'use client'; // Ensure it's a client component

import { useEffect, useState } from 'react';
import '../../styles/styles.css'; // Adjust the import path if needed

type Message = {
  id: string; // Use string since it's UUID
  original_message: string;
  edited_message: string | null;
};

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/get-messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error: any) {
        setError(error.message || 'Unknown error occurred');
      }
    };

    fetchMessages();
  }, []);

  // Handle edit action
  const handleEditClick = (messageId: string, currentMessage: string) => {
    setEditingMessageId(messageId);
    setEditedMessage(currentMessage); // Set the current message in the input field
  };

  // Handle save (update the edited message)
  const handleSave = async (messageId: string) => {
    try {
      const response = await fetch('/api/edit-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId,
          edited_message: editedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit message');
      }

      // Update the local messages state after saving
      const updatedMessages = messages.map((message) =>
        message.id === messageId
          ? { ...message, edited_message: editedMessage }
          : message
      );
      setMessages(updatedMessages);
      setEditingMessageId(null); // Exit edit mode after saving
    } catch (error: any) {
      setError(error.message || 'Unknown error occurred');
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
