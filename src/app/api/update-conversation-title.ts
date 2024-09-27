import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

const updateConversationTitle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { conversationId, title } = req.body;

    if (!conversationId || !title) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);
      if (error) {
        console.error('Error updating conversation title:', error);
        return res.status(500).json({ message: 'Error updating conversation title' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default updateConversationTitle;
