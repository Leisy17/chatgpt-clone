import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, original_message, edited_message, version, created_at,
        branches (branch_message)
      `)
      .eq('conversation_id', conversationId);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
