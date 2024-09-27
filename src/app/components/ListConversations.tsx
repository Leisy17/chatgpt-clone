"use client";

import { useEffect } from 'react';
import { Conversation } from '../types/types';

interface ListConversationsProps {
    userId: string;
    conversations: Conversation[];
    onSelectConversation: (conversationId: string) => void;
}

const ListConversations: React.FC<ListConversationsProps> = ({ userId, conversations, onSelectConversation }) => {
    
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`/api/get-conversations?userId=${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data: Conversation[] = await response.json();
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
                    <li key={conversation.id}>
                        <button
                            onClick={() => onSelectConversation(conversation.id)}
                            className="conversation-item"
                        >
                            {conversation.title || 'Untitled Conversation'} {/* Show default if title is missing */}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListConversations;
