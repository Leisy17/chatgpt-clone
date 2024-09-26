import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

interface UserInsert {
  username: string;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password }: UserInsert = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Use Supabase Auth to create a user
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      return res.status(400).json({ error: signupError.message });
    }

    const user = data.user; // Accessing user from the nested data

    if (!user) {
      return res.status(500).json({ error: 'User creation failed.' });
    }

    // After successful signup, insert additional user data into your users table
    const { error } = await supabase
      .from('users')
      .insert([{ id: user.id, username, email }]); // Assuming user ID is the Supabase auth user ID

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ id: user.id, username, email });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
