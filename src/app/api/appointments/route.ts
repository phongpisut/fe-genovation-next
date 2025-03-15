import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { formatISO } from 'date-fns';

export async function POST(req: NextRequest) {
    const { patient_id, doctor_id, notes, timeslot, start_date } = await req.json();
  const supabase = await createClient();

  const { error} = await supabase
    .schema('api')
    .from('appointments')
    .insert({ doctor_id, patient_id, notes, timeslot, start_date });

  if (error) {
    return NextResponse.json(
      { error: error?.message },
      { status: 401 }
    );
  }

  return NextResponse.json({ status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appointment_id = await searchParams.get('id')!;
const supabase = await createClient();

const { error} = await supabase
  .schema('api')
  .from('appointments')
  .update({ deleted_at : formatISO(new Date()) })
  .eq('id', appointment_id);

if (error) {
  return NextResponse.json(
    { error: error?.message },
    { status: 401 }
  );
}

return NextResponse.json({ status: 200 });
}