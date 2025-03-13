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

  const { data: appointmentData, error: appointmentError } = await supabase
    .schema('api')
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctor_id)
    .gte('start_date', new Date().toISOString().split('T')[0]);

  console.log(new Date().toISOString().split('T')[0]);

  if (error) {
    return NextResponse.json(
      { error: appointmentError?.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ data, appointmentData }, { status: 200 });
}
