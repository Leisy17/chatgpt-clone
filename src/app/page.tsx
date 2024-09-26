"use client";

import { useEffect, useState } from 'react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ListConversations from './components/ListConversations';
import Login from './components/Login';
import Register from './components/Register';
import { Message } from './types/types';
import './globals.css'; // Assuming you have global styles

const HomePage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null); // User ID state
    const [conversationId, setConversationId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (conversationId) {
                const response = await fetch(`/api/get-messages?conversationId=${conversationId}`);
                const data: Message[] = await response.json();
                setMessages(data);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const handleSendMessage = async (original_message: string) => {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ original_message, conversationId }),
        });
        const newMessage: Message = await response.json();
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleEditMessage = async (id: string, edited_message: string) => {
        const response = await fetch('/api/edit-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
        
        if (user.conversations.length === 0) {
            const newConversationId = await createConversation(user.id);
            setConversationId(newConversationId);
        } else {
            setConversationId(user.conversations[0]?.id || null);
        }
    };

    const createConversation = async (userId: string) => {
        const response = await fetch('/api/create-conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, title: 'New Conversation' }),
        });
        const newConversation = await response.json();
        return newConversation.id;
    };

    const handleSelectConversation = (conversationId: string) => {
        setConversationId(conversationId);
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Welcome to the ChatGPT Clone!</h1>
            </header>
            <main className="main-content">
                {isAuthenticated ? (
                    <>
                        <ListConversations 
                            userId={userId!}
                            onSelectConversation={handleSelectConversation} 
                        />
                        <ChatInput onSend={handleSendMessage} conversationId={conversationId} />
                        <MessageList messages={messages} onEdit={handleEditMessage} conversationId={conversationId} />
                    </>
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
