import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { original_message } = req.body;
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{ original_message }])
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
