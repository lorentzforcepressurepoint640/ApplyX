import { google } from 'googleapis';

export async function sendEmailWithGmail(
  accessToken: string,
  refreshToken: string,
  to: string,
  subject: string,
  message: string,
  attachment?: { filename: string; content: string } // content is base64 string
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ 
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Simplified email construction for Gmail API
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  
  let emailParts = [
    `To: ${to}`,
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    'Content-Type: multipart/mixed; boundary="foo_bar_baz"',
    '',
    '--foo_bar_baz',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    message,
  ];

  if (attachment) {
    emailParts.push(
      '',
      '--foo_bar_baz',
      `Content-Type: application/pdf; name="${attachment.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      '',
      attachment.content
    );
  }

  emailParts.push('--foo_bar_baz--');

  const email = emailParts.join('\n');
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });
    return res.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message || 'Unknown Gmail error';
    console.error('Gmail API error details:', error.response?.data || error.message);
    throw new Error(`Gmail API: ${errorMsg}`);
  }
}
