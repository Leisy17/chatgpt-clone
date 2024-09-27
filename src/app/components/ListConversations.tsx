"use client";

import { useEffect, useState } from 'react';
import { Conversation } from '../types/types';

interface ListConversationsProps {
    userId: string;
    onSelectConversation: (conversationId: string) => void;
}

const ListConversations: React.FC<ListConversationsProps> = ({ userId, onSelectConversation }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`/api/get-conversations?userId=${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data: Conversation[] = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        if (userId) {
            fetchConversations();
        }
    }, [userId]);

    return (
        <div className="conversation-list">
            <h2>Your Conversations</h2>
            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.id} onClick={() => onSelectConversation(conversation.id)}>
                        {conversation.title || 'Untitled Conversation'} {/* Display a default title if none is provided */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListConversations;
