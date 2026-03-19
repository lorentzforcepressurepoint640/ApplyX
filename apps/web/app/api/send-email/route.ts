import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { sendEmailWithGmail } from '@/lib/gmail';



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

    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('access_token, refresh_token')
      .eq('email', userEmail)
      .single();

    if (!userProfile?.access_token) {
      return NextResponse.json({ 
        error: 'Google OAuth token not found. Please log in again.' 
        }, { status: 401 });
    }

    // Try to find resume attachment from Supabase
    const { data: resumeData } = await supabase
      .from('resumes')
      .select('resume_text, file_name, file_content')
      .eq('user_id', userEmail)
      .single();

    // Note: If file_content was stored as a buffer in DB, we'd use it here.
    // For now, let's assume we store the base64 content in Supabase if we want attachments.
    const attachment = (resumeData && resumeData.file_content) ? {
      filename: resumeData.file_name || 'Resume.pdf',
      content: resumeData.file_content, // Assuming base64 string in Supabase
      contentType: 'application/pdf'
    } : undefined;

    const result = await sendEmailWithGmail(
      userProfile.access_token,
      userProfile.refresh_token || '',
      to,
      subject,
      body,
      attachment
    );

    // Save record to DB in Supabase 'sent_emails' table
    await supabase.from('sent_emails').insert({
      user_id: userEmail,
      recipient: to,
      subject,
      body,
      thread_id: result.threadId,
      message_id: result.id,
      status: 'sent'
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully with attachment', result });

  } catch (error: any) {
    const message = error.message || 'Failed to send email';
    console.error('API send-email error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
