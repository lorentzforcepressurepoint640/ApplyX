<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:8b5cf6&height=200&section=header&text=ApplyX&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Stop%20copy-pasting.%20Start%20landing%20jobs.&descAlignY=60&descSize=20&descColor=c4b5fd" width="100%"/>

<br/>

[![GitHub stars](https://img.shields.io/github/stars/kiet7uke/ApplyX?style=for-the-badge&logo=github&color=6366f1)](https://github.com/kiet7uke/ApplyX/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a78bfa.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Made with Llama](https://img.shields.io/badge/Powered%20by-Llama%203.1-ec4899.svg?style=for-the-badge)](https://groq.com)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome)](https://github.com/kiet7uke/ApplyX)
<br/>

<div style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; border: 1px solid rgb(224, 224, 224); border-radius: 12px; padding: 20px; max-width: 500px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 8px; text-align: left; margin: 0 auto;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;"><img alt="ApplyX" src="https://ph-files.imgix.net/77e20b26-210d-4850-b99c-fe3c2000d457.png?auto=format&amp;fit=crop&amp;w=80&amp;h=80" style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;"><div style="flex: 1 1 0%; min-width: 0px;"><h3 style="margin: 0px; font-size: 18px; font-weight: 600; color: rgb(26, 26, 26); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">ApplyX</h3><p style="margin: 4px 0px 0px; font-size: 14px; color: rgb(102, 102, 102); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">Apply to jobs with 1-click personalized outreach</p></div></div><a href="https://www.producthunt.com/products/applyx-2?embed=true&amp;utm_source=embed&amp;utm_medium=post_embed" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 4px; margin-top: 12px; padding: 8px 16px; background: rgb(255, 97, 84); color: rgb(255, 255, 255); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Check it out on Product Hunt →</a></div>

<br/>

> **Apply to jobs with personalized outreach in 1 click — powered by Llama 3 & Groq.**
> 
> *The open-source job application tool that actually respects your time.*

<br/>

```
📄 See job post → ⚡ 1 click → 💌 Personalized email sent. Done.
```

<br/>

---

</div>

## 😤 The Problem (You Know This Pain)

```
You:  *copies job description*
You:  *opens ChatGPT*
You:  "Write me a cold email for this job"
GPT:  "Dear Hiring Manager, I am writing to express my keen interest..."
You:  *dies inside*
You:  *does this 30 more times today*
```

**There has to be a better way.**

---

## ⚡ Enter ApplyX

![ApplyX Demo](https://i.imgur.com/placeholder-demo.gif)
> *1-click from LinkedIn post → personalized email in your drafts. Real demo gif coming — PRs welcome!*

ApplyX is a **Chrome extension + web dashboard** that lives on LinkedIn. Spot a job post, click once, and a laser-targeted cold email — written from *your* resume, in *your* voice — is ready to send via Gmail. No copy-paste. No generic templates. No cringe.

---

## 🔥 Features

| Feature | What it does |
|---|---|
| **⚡ 1-Click Generation** | Reads the LinkedIn post, grabs your resume, writes a tailored email via Groq (Llama 3.1) in ~1 second |
| **📎 Auto-attach Resume** | Your PDF resume is automatically attached to every outreach email |
| **📬 One-Click Send** | Fires the email via Gmail API — without leaving the LinkedIn page |
| **🎨 Dynamic Personalization** | Your name, portfolio, and vibe are baked into every message |
| **🔒 Self-Hosted & Private** | Your data lives in **your** Supabase. Zero middlemen. |
| **🆓 Actually Free** | Groq's free tier handles thousands of generations per day |

---

## 🚀 Quick Start

> **Prerequisites**: Node.js 18+, a Google Cloud project, a Supabase account, a Groq API key.

### 1. Clone & Install

```bash
git clone https://github.com/kiet7uke/ApplyX.git
cd ApplyX
```

### 2. Fire up the Extension

```bash
cd apps/extension
npm install
npm run dev
```

Then in Chrome → `chrome://extensions` → **Load Unpacked** → select `apps/extension/build/chrome-mv3-dev`

### 3. Fire up the Dashboard

```bash
cd apps/web
cp .env.example .env.local  # fill in your keys (see below)
npm install
npm run dev
```

Open `localhost:3000` 🎉

### 4. Connect Everything

1. Log into the dashboard → **Manage Profile**
2. Upload your **resume PDF** + add your **portfolio URL**
3. Copy your **Extension Key** from Dashboard Settings
4. Paste it into the LinkedIn sidebar settings panel
5. Go to LinkedIn. Find a job. Click the button. ✅

---

## 🛠️ Full Infrastructure Setup

<details>
<summary><b>🗄️ Supabase (Database)</b> — click to expand</summary>

1. Create a free project at [supabase.com](https://supabase.com)
2. In the **SQL Editor**, run this schema:

```sql
-- Users profile table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  portfolio_url text,
  resume_url text,
  extension_key uuid default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table profiles enable row level security;

create policy "Users can view their own profile."
  on profiles for select using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );
```

3. Note your `Project URL` and `anon public` key from **Project Settings → API**

</details>

<details>
<summary><b>🔑 Google OAuth & Gmail API</b> — click to expand</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **New Project**
2. Enable the **Gmail API**: APIs & Services → Library → search "Gmail API" → Enable
3. Create credentials: APIs & Services → **Credentials** → Create OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Required OAuth Scopes:
   - `openid`
   - `email`  
   - `profile`
   - `https://www.googleapis.com/auth/gmail.send`
5. Save your `Client ID` and `Client Secret`

</details>

<details>
<summary><b>🤖 Groq (AI Engine)</b> — click to expand</summary>

1. Sign up free at [console.groq.com](https://console.groq.com/)
2. Create an API key
3. That's it. Llama 3.1 is absurdly fast (~300 tokens/sec) and the free tier is incredibly generous.

No OpenAI bill. No rate limit anxiety. Just vibes. ✨

</details>

### 🔐 Environment Variables

Create `apps/web/.env.local`:

```bash
# 🤖 AI
GROQ_API_KEY=gsk_...

# 🗄️ Database  
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# 🔑 Google OAuth + Gmail
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# 🔒 NextAuth
NEXTAUTH_SECRET=your-super-secret-random-string  # run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗂️ Project Structure

```
ApplyX/
├── apps/
│   ├── extension/          # 🧩 Chrome Extension (Plasmo + React)
│   │   └── src/
│   │       ├── sidebar/    # LinkedIn sidebar UI
│   │       └── background/ # Service worker
│   │
│   └── web/                # 🌐 Dashboard & Backend (Next.js)
│       ├── app/            # Next.js App Router
│       ├── components/     # React components
│       └── lib/            # Supabase, NextAuth, Gmail helpers
│
└── packages/               # 📦 Shared logic & types
```

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    LinkedIn Feed                         │
│                                                         │
│  [Job Post by Recruiter]          ┌──────────────────┐  │
│  "We're hiring a Senior           │   ApplyX Sidebar │  │
│   Backend Engineer at Stripe!"    │                  │  │
│                                   │  [Generate ⚡]   │  │
│                                   └────────┬─────────┘  │
└────────────────────────────────────────────┼────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Your Resume   │
                                    │  + Post Context │
                                    │  + Your Name    │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Groq Llama 3.1 │
                                    │   (~800ms) ⚡   │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Personalized   │
                                    │  Email → Gmail  │
                                    │     Sent ✅     │
                                    └─────────────────┘
```

---

## 🤝 Contributing

ApplyX is fully open-source and contributions are very welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-amazing-idea
git commit -m "feat: add your amazing idea"
git push origin feature/your-amazing-idea
# Open a PR 🚀
```

**Ideas for contributions:**
- [ ] 🎯 LinkedIn Easy Apply form auto-fill
- [ ] 📊 Application tracking dashboard
- [ ] 🌐 Support for other job platforms (Wellfound, Lever, Greenhouse)
- [ ] 🔁 Follow-up email scheduling
- [ ] 🧪 A/B testing different email tones
- [ ] 🌍 Multi-language outreach support

---

## 💬 Frequently Asked Questions

**Q: Is this actually free?**  
A: Yes. Groq's free tier handles ~14,400 requests/day. You won't hit that limit job hunting.

**Q: Is my resume data safe?**  
A: Your resume lives in your own Supabase instance. ApplyX never touches it.

**Q: Will recruiters know I used AI?**  
A: The output is grounded in *your* real resume and *their* actual job post — it reads as genuinely tailored because it is.

**Q: Does it work with LinkedIn Premium?**  
A: Works with any LinkedIn account. Premium not required.

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kiet7uke/ApplyX&type=Date)](https://star-history.com/#kiet7uke/ApplyX&Date)

---

<div align="center">

**If ApplyX helped you land an interview, drop a ⭐ — it keeps the project alive.**

<br/>

Built with 💜 by [kiet7uke](https://github.com/kiet7uke) because job hunting is exhausting.

*Let's make it smarter, together.*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,100:6366f1&height=100&section=footer" width="100%"/>

</div>