import { supabase } from '../../../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { original_message, conversationId } = await req.json();

        if (!original_message || !conversationId) {
            return NextResponse.json({ error: 'original_message and conversationId are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([{ original_message, conversation_id: conversationId }])
            .single();

        if (error) {
            console.error('Error inserting message:', error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
