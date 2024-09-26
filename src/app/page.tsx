
"use client";
import { useEffect, useState } from 'react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import { Message } from './types/types';

const HomePage = () => {
    const [messages, setMessages] = useState<Message[]>([]); // Explicitly set the type here

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('/api/get-messages');
            const data: Message[] = await response.json();
            setMessages(data);
        };

        fetchMessages();
    }, []);

    const handleSendMessage = async (original_message: string) => {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ original_message }),
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

    return (
        <div>
            <h1>Welcome to the ChatGPT Clone!</h1>
            <ChatInput onSend={handleSendMessage} />
            <MessageList messages={messages} onEdit={handleEditMessage} />
        </div>
    );
};

export default HomePage;
