import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('file_name')
      .eq('user_id', session.user.email)
      .single();

    return NextResponse.json({ exists: !!resume, fileName: resume?.file_name });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
