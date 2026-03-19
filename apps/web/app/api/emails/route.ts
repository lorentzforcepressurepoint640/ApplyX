import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SentEmail from '@/models/SentEmail';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const emails = await SentEmail.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ emails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
