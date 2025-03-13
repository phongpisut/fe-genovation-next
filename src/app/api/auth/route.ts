import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const supabase = await createClient()
  
    const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    return NextResponse.json({ user, session }, { status: 200 });
  }