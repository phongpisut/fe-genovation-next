import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const date = searchParams.get('date') || '';
  const { dateRange } = await req.json();

  const supabase = await createClient();

  let query = supabase.schema('api').from('combined_view').select(`*`);
  // .or(`source.neq.appointment,and(source.eq.appointment,start_date.gte.${format(new Date(), 'yyyy-MM-dd')})`);

  if (text) {
    query = query.or(
      `name.ilike.%${text}%,doctor_name.ilike.%${text}%,patient_name.ilike.%${text}%`
    );
  }

  if (filter) {
    const filterParts = filter.split('-');
    const filterConditions = [];
    if (filterParts.length > 0) {
      if (filterParts.includes('doc')) {
        filterConditions.push('source.eq.doctor');
      }

      if (filterParts.includes('ap')) {
        filterConditions.push('source.eq.appointment');
      }

      if (filterParts.includes('pat')) {
        filterConditions.push('source.eq.patient');
      }

      if (filterConditions.length > 0) {
        query = query.or(filterConditions.join(','));
      }
    }
  }

  if (date) {
    query = query.eq('start_date', date);
  }

  query = query.filter('deleted_at', 'is', null);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
