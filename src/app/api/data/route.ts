import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const text = await searchParams.get('search')!;
    const supabase = await createClient();

    const { data, error } = await supabase
        .schema("api")
        .from("combined_view")
        .select(`*`)
        .or(`name.ilike.%${text}%,doctor_name.ilike.%${text}%,patient_name.ilike.%${text}%`);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
}
