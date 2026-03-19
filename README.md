# 🚀 ApplyX

**Apply to jobs with personalized outreach in 1 click — powered by AI.**

ApplyX is an open-source tool designed to make job hunting faster and more personal. No more generic "I'm interested" messages. Generate high-quality, tailored outreach based on the LinkedIn post and your resume, directly in your browser.

## 🔥 Key Features

- **1-Click Generation**: Tailors messages instantly to the LinkedIn post context.
- **Resume-Aware**: Uses your actual background to find the best angle for outreach.
- **Privacy First**: All your data (Resume, OpenAI Key) stays in your browser's local storage.
- **Open Source**: Free forever, built for the community.

## ⚡ Quick 2-Minute Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/kiet7uke/ApplyX.git
   cd ApplyX
   ```
2. **Setup Extension**:
   - Go to `apps/extension` and run `npm install`.
   - Run `npm run dev`.
   - Open Chrome and go to `chrome://extensions`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `apps/extension/build/chrome-mv3-dev` folder.
3. **Configure ApplyX**:
   - Open LinkedIn.
   - Click the floating Mail icon or the "Send Email" button on posts.
   - Enter your **OpenAI API Key** and paste your **Resume/Bio** in the settings.
   - Start applying! ✅

## ⚙️ Project Structure

- `apps/extension`: The Chrome extension (Plasmo + React).
- `apps/web`: The Next.js dashboard/backend (Supabase + Auth).
- `packages/ai-core`: Shared AI logic and prompts.

## 🛠️ Step-by-Step Setup

### 1. Supabase Setup (Database & Storage)
1.  Create a free project at [Supabase](https://supabase.com).
2.  Go to the **SQL Editor** and run the following commands to create the necessary tables:
    ```sql
    -- Create profiles table
    CREATE TABLE profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      image TEXT,
      access_token TEXT,
      refresh_token TEXT,
      api_key TEXT UNIQUE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create resumes table
    CREATE TABLE resumes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT UNIQUE NOT NULL,
      resume_text TEXT NOT NULL,
      file_name TEXT,
      file_content TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create sent_emails table
    CREATE TABLE sent_emails (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT,
      body TEXT,
      thread_id TEXT,
      message_id TEXT,
      status TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    ```
3.  Go to **Project Settings > API** and get your `Project URL` and `anon public` key.

### 2. Google OAuth & Gmail API Setup
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project**.
3.  Search for **Gmail API** and click **Enable**.
4.  Go to **OAuth consent screen**:
    *   Choose **External**.
    *   Add your email to **Test users**.
    *   Add scopes: `openid`, `https://www.googleapis.com/auth/userinfo.email`, `https://www.googleapis.com/auth/userinfo.profile`, and `https://www.googleapis.com/auth/gmail.send`.
5.  Go to **Credentials**:
    *   Click **Create Credentials > OAuth client ID**.
    *   Application type: **Web application**.
    *   Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (and your production URL).
    *   Copy your **Client ID** and **Client Secret**.

### 3. Environment Variables
Create a `.env.local` in `apps/web` with:
```bash
GROQ_API_KEY=gsk_your_groq_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=any_random_string
```
> Get your free Groq API key at [console.groq.com](https://console.groq.com/).

### 4. Running the Project
1.  Root: `npm install`
2.  Extension: `cd apps/extension && npm run dev`
3.  Web: `cd apps/web && npm run dev`

## 🌍 Open Source Growth Hack

If this tool helps you land a job, consider giving us a star! ⭐

---

*"I built this because job hunting is exhausting. Let's make it smarter together."*

Built by [kiet7uke](https://github.com/kiet7uke)
