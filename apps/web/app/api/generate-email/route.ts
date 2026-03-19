import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { generatePersonalizedEmail } from '@/lib/openai';


export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    let userEmail: string | undefined;

    if (apiKey) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('api_key', apiKey)
        .single();
      if (profile) userEmail = profile.email;
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

    const [resumeFetch, profileFetch] = await Promise.all([
      supabase.from('resumes').select('resume_text').eq('user_id', userEmail).single(),
      supabase.from('profiles').select('portfolio_url, name').eq('email', userEmail).single()
    ]);

    if (!resumeFetch.data) {
      return NextResponse.json({ 
        error: 'Resume not found. Please upload your resume first on the dashboard.' 
      }, { status: 404 });
    }

    const generated = await generatePersonalizedEmail(
      resumeFetch.data.resume_text,
      postText,
      authorName,
      profileFetch.data?.name || "User",
      profileFetch.data?.portfolio_url || ""
    );

    return NextResponse.json(generated);

  } catch (error: any) {
    console.error('Error generating email:', error);
    return NextResponse.json({ error: error.message || 'Error generating email' }, { status: 500 });
  }
}
