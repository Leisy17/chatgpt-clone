// src/app/api/messages/route.ts
import { supabase } from '../../../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { original_message } = await req.json(); // Extract the original message from the request body

    const { data, error } = await supabase
        .from('messages')
        .insert([{ original_message }])
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 200 });
}
