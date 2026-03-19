import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('api_key')
    .eq('email', session.user.email)
    .single();

  if (error || !profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Generate key if doesn't exist
  let apiKey = profile.api_key;
  if (!apiKey) {
    apiKey = `ext_${crypto.randomBytes(24).toString('hex')}`;
    await supabase
      .from('profiles')
      .update({ api_key: apiKey })
      .eq('email', session.user.email);
  }

  return NextResponse.json({ apiKey });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Rotate key
  const newKey = `ext_${crypto.randomBytes(24).toString('hex')}`;
  await supabase
    .from('profiles')
    .update({ api_key: newKey })
    .eq('email', session.user.email);

  return NextResponse.json({ apiKey: newKey });
}
