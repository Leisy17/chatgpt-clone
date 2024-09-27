import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { original_message, conversationId } = req.body;

    if (!original_message || !conversationId) {
      return res.status(400).json({ error: 'original_message and conversationId are required' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{ original_message, conversationId }])
      .single();

    if (error) {
      console.error('Error inserting message:', error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
