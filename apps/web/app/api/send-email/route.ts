import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SentEmail from '@/models/SentEmail';
import Resume from '@/models/Resume';
import { sendEmailWithGmail } from '@/lib/gmail';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    let userEmail: string | undefined;

    if (apiKey) {
      await dbConnect();
      const user = await User.findOne({ apiKey });
      if (user) userEmail = user.email;
    }

    if (!userEmail) {
      const session = await auth();
      userEmail = session?.user?.email || undefined;
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: userEmail });

    if (!user?.accessToken) {
      return NextResponse.json({ 
        error: 'Google OAuth token not found. Please log in again.' 
        }, { status: 401 });
    }

    // Try to find resume attachment
    const resume = await Resume.findOne({ userId: userEmail });
    const attachment = (resume && resume.content) ? {
      filename: resume.fileName || 'Resume.pdf',
      content: resume.content.toString('base64'),
      contentType: 'application/pdf'
    } : undefined;

    const result = await sendEmailWithGmail(
      user.accessToken,
      user.refreshToken || '',
      to,
      subject,
      body,
      attachment
    );

    // Save record to DB
    await SentEmail.create({
      userId: user._id,
      to,
      subject,
      body,
      threadId: result.threadId,
      messageId: result.id,
      status: 'sent'
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully with attachment', result });

  } catch (error: any) {
    const message = error.message || 'Failed to send email';
    console.error('API send-email error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
