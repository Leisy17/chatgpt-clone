import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, edited_message } = req.body;

    const { data: message } = await supabase
      .from('messages')
      .select('version')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('messages')
      .insert([{ parent_id: id, edited_message, version: message.version + 1 }])
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }
}
