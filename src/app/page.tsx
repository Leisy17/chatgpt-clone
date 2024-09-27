'use client';

import { useEffect, useState } from 'react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ListConversations from './components/ListConversations';
import Login from './components/Login';
import Register from './components/Register';
import { Message, Conversation } from './types/types'; // Assuming Conversation type is also defined here
import './globals.css'; 

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const response = await fetch(`/api/get-messages?conversationId=${conversationId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch messages.');
          }
          const data: Message[] = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      } else {
        setMessages([]); // Reset messages if no conversation is selected
      }
    };

    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async (original_message: string) => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_message, conversationId }),
    });
    const newMessage: Message = await response.json();
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleEditMessage = async (id: string, edited_message: string) => {
    const response = await fetch('/api/edit-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, edited_message }),
    });
    const updatedMessage: Message = await response.json();
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
  };

  const handleLoginSuccess = async (user: { id: string; conversations: any[] }) => {
    setIsAuthenticated(true);
    setUserId(user.id);

    // Fetch the user's conversations after successful login
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/get-conversations?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data: Conversation[] = await response.json();
        setConversations(data);
        
        // Automatically select the first conversation if available
        if (data.length > 0) {
          setConversationId(data[0].id);
        } else {
          const newConversationId = await createConversation(user.id);
          setConversationId(newConversationId); // Select the new conversation
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  };

  const createConversation = async (userId: string) => {
    const response = await fetch('/api/create-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title: 'New Conversation' }),
    });
    const newConversation = await response.json();
    return newConversation.id; // Return the ID of the new conversation
  };

  const handleSelectConversation = (selectedConversationId: string) => {
    setConversationId(selectedConversationId); // Update the selected conversation ID
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Welcome to the ChatGPT Clone!</h1>
      </header>
      <main className="main-content">
        {isAuthenticated ? (
          <div className="flex">
            <ListConversations 
              userId={userId!} 
              onSelectConversation={handleSelectConversation} 
            />
            <div className="chat-area">
              {conversationId ? (
                <>
                  <ChatInput onSend={handleSendMessage} conversationId={conversationId} />
                  <MessageList
                    messages={messages}
                    onEdit={handleEditMessage}
                    conversationId={conversationId}
                  />
                </>
              ) : (
                <p>Please select or create a conversation to start chatting.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-container">
            <Login onLoginSuccess={handleLoginSuccess} />
            <p />
            <Register />
          </div>
        )}
      </main>
      <footer className="footer">
        <p>&copy; 2024 ChatGPT Clone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
