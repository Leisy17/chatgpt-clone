export type Message = {
    id: string;
    original_message: string;
    edited_message?: string | null; // Allow edited_message to be null
    version: number;
    created_at: string; // Assuming created_at is a string
    branches?: { branch_message: string }[]; // Adjust if you have branches
};
