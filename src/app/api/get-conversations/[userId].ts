import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId as string);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
