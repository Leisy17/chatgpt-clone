export type Message = {
  id: string; // Use string since it's UUID
  original_message: string;
  edited_message: string | null; // Ensure this allows null only
};


export type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export type Conversation = {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
};



