import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    const { userId, title } = await request.json();
    if (!userId || !title) {
        return NextResponse.json(
            { error: 'User ID and title are required.' },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('conversations')
        .insert([{ user_id: userId, title }])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 });
}
