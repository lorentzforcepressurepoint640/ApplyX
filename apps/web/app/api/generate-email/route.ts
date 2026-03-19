import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import User from '@/models/User';
import { generatePersonalizedEmail } from '@/lib/openai';

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
      if (user) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      const session = await auth();
      userEmail = session?.user?.email || undefined;
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postText, authorName, company } = await req.json();

    if (!postText || !authorName) {
      return NextResponse.json({ error: 'Post text and author name are required' }, { status: 400 });
    }

    await dbConnect();
    const [resumeData, user] = await Promise.all([
      Resume.findOne({ userId: userEmail }),
      User.findOne({ email: userEmail })
    ]);

    if (!resumeData) {
      return NextResponse.json({ 
        error: 'Resume not found. Please upload your resume first on the dashboard.' 
      }, { status: 404 });
    }

    const generated = await generatePersonalizedEmail(
      resumeData.resumeText,
      postText,
      authorName,
      user?.portfolioUrl || "https://codewsahhil.vercel.app"
    );

    return NextResponse.json(generated);

  } catch (error: any) {
    console.error('Error generating email:', error);
    return NextResponse.json({ error: error.message || 'Error generating email' }, { status: 500 });
  }
}
