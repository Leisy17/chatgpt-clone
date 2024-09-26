import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, original_message, edited_message, version, created_at,
        branches (branch_message)
      `);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
