import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctor_id = await searchParams.get('id')!;
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('doctors')
    .select(`*`)
    .eq('id', doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { created_at, fullname, notes, specialty, schedule } =
    await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('doctors')
    .insert({ created_at, fullname, notes, specialty, schedule })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const { id, created_at, fullname, notes, specialty, schedule } =
    await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('doctors')
    .update({ created_at, fullname, notes, specialty, schedule })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctor_id = await searchParams.get('id')!;
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('doctors')
    .delete()
    .eq('id', doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
