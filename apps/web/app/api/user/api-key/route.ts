import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Generate key if doesn't exist
  if (!user.apiKey) {
    user.apiKey = `ext_${crypto.randomBytes(24).toString('hex')}`;
    await user.save();
  }

  return NextResponse.json({ apiKey: user.apiKey });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  // Rotate key
  const newKey = `ext_${crypto.randomBytes(24).toString('hex')}`;
  await User.findOneAndUpdate({ email: session.user.email }, { apiKey: newKey });

  return NextResponse.json({ apiKey: newKey });
}
