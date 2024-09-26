import { supabase } from '../../../lib/supabase'; // Correct path to Supabase
import { NextResponse } from 'next/server';

// Function to handle the edit request
export async function POST(request: Request) {
  try {
    const { id, edited_message } = await request.json(); // Get id and edited_message from request

    if (!id || !edited_message) {
      return NextResponse.json({ error: 'Invalid request, id and edited_message are required' }, { status: 400 });
    }

    // Fetch the current version of the message
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('version') // Get the current version
      .eq('id', id)
      .single(); // We expect one single message

    if (fetchError || !message) {
      return NextResponse.json({ error: fetchError ? fetchError.message : 'Message not found' }, { status: 400 });
    }

    // Increment the version and update the message
    const newVersion = message.version + 1; // Increment version

    const { data, error: updateError } = await supabase
      .from('messages')
      .update({ edited_message, version: newVersion }) // Update the edited message
      .eq('id', id)
      .select() // Select the updated message
      .single(); // Return a single message

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Return the updated message
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
