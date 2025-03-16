import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patient_id = await searchParams.get('id')!;
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('patients')
    .select(`*`)
    .eq('id', patient_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { fullname, notes, tel } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('patients')
    .insert({ fullname, notes, tel });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const { id, fullname, notes, tel } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('patients')
    .update({ fullname, notes, tel })
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
    .from('patients')
    .delete()
    .eq('id', doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
