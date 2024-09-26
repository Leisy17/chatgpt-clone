import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, title } = req.body;

        const { data, error } = await supabase
            .from('conversations')
            .insert([{ user_id: userId, title }])
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
