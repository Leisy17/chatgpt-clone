'use client';

import { useEffect, useState } from 'react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ListConversations from './components/ListConversations';
import Login from './components/Login';
import Register from './components/Register';
import { Message, Conversation } from './types/types';
import './globals.css'; 

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId && !isCreatingConversation) {
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
        setMessages([]);
      }
    };

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    setPollingInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [conversationId, isCreatingConversation]);

  useEffect(() => {
    if (messages.length > 0 && conversationId) {
      const latestMessage = messages[messages.length - 1];

      if (latestMessage && latestMessage.original_message) {
        updateConversationTitle(conversationId, latestMessage.original_message);
      }
    }
  }, [messages, conversationId]);

  const handleSendMessage = async (original_message: string, conversationId: string | null) => {
    if (!conversationId) {
      console.error('No conversation ID provided');
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_message, conversationId }),
      });

      if (!response.ok) {
        console.error('Failed to send message:', response.statusText);
        throw new Error('Failed to send message');
      }

      const newMessage: Message = await response.json();
      setMessages((prev) => [...prev, newMessage]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  const updateConversationTitle = async (conversationId: string | null, title: string) => {
    if (!conversationId || !title) {
      console.error('Missing conversationId or title');
      return;
    }

    try {
      const response = await fetch('/api/update-conversation-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update conversation title');
      }

      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, title } : conversation
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };


  const handleEditMessage = async (id: string, edited_message: string) => {
    try {
      const response = await fetch('/api/edit-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, edited_message }),
      });

      const updatedMessage: Message = await response.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleLoginSuccess = async (user: { id: string; conversations: any[] }) => {
    setIsAuthenticated(true);
    setUserId(user.id);

    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/get-conversations?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data: Conversation[] = await response.json();
        setConversations(data);
        
        if (data.length > 0) {
          setConversationId(data[0].id);
        } else {
          await createConversation(user.id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  };

  const createConversation = async (userId: string) => {
    try {
      const response = await fetch('/api/create-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: 'New Conversation' }),
      });

      if (!response.ok) {
        console.error('Failed to create conversation');
        return;
      }

      const newConversation = await response.json();
      setConversationId(newConversation.id);
      setIsCreatingConversation(false);
      setConversations((prev) => [...prev, newConversation]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = (selectedConversationId: string) => {
    setConversationId(selectedConversationId);
    setIsCreatingConversation(false);
  };

  const handleCreateConversation = () => {
    createConversation(userId!);
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
              conversations={conversations}
            />
            <div className="chat-area">
              <button onClick={handleCreateConversation} className="create-conversation-button">
                Create New Conversation
              </button>
              {conversationId ? (
                <>
                  <ChatInput onSend={handleSendMessage} conversationId={conversationId} />
                  {isCreatingConversation ? null : (
                    <MessageList
                      messages={messages}
                      onEdit={handleEditMessage}
                      conversationId={conversationId}
                    />
                  )}
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
