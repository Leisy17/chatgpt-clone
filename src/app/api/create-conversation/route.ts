import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    const { userId, title } = await request.json();

    // Validate input
    if (!userId || !title) {
        return NextResponse.json(
            { error: 'User ID and title are required.' },
            { status: 400 }
        );
    }

    // Insert new conversation into the database
    const { data, error } = await supabase
        .from('conversations') // Make sure you have a conversations table
        .insert([{ user_id: userId, title }]) // Adjust according to your table structure
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 }); // Return the newly created conversation
}
