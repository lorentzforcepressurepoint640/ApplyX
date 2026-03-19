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
- `apps/web`: The optional dashboard/backend (Next.js).
- `packages/ai-core`: Shared AI logic and prompts (coming soon).

## 🌍 Open Source Growth Hack

If this tool helps you land a job, consider giving us a star! ⭐

---

*"I built this because job hunting is exhausting. Let's make it smarter together."*

Built by [kiet7uke](https://github.com/kiet7uke)
