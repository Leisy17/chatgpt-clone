import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { conversationId, title } = await request.json();
    if (!conversationId || !title) {
      return NextResponse.json(
        { message: 'Conversation ID and title are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating conversation title:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
