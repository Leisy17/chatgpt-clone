// CreateConversation.tsx

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Conversation } from '../types/types';

type CreateConversationProps = {
  userId: string;
  onConversationCreated: (newConversation: Conversation) => void; // Use the full Conversation type
};

const CreateConversation = ({ userId, onConversationCreated }: CreateConversationProps) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title }) // Assuming `user_id` is needed
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      onConversationCreated(data as Conversation); // Cast the data to Conversation type
      setTitle(''); // Clear the input
    }
  };

  return (
    <div className="create-conversation">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter conversation title"
      />
      <button onClick={handleCreate}>Create Conversation</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateConversation;
