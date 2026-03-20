# Instant Job Apply | AI-Powered Job Outreach

Build on Next.js 15+ and Plasmo. Send personalized job outreach emails directly from LinkedIn using Azure OpenAI and Gmail API.

## 🚀 Setup Instructions

### 1. Next.js Web App

1.  **Environment Variables**:
    *   Copy `.env.example` to `.env.local`.
    *   Fill in your **Google OAuth** credentials (Client ID, Secret).
    *   Fill in your **MongoDB URI**.
    *   Fill in your **Azure OpenAI** details.
    *   Generate a `NEXTAUTH_SECRET` (e.g., via `openssl rand -base64 32`).

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

### 2. Chrome Extension (Plasmo)

1.  **Navigate to directory**:
    ```bash
    cd chrome-extension
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Extension in Dev Mode**:
    ```bash
    npm run dev
    ```

4.  **Load in Chrome**:
    *   Go to `chrome://extensions/`.
    *   Enable "Developer mode".
    *   Click "Load unpacked".
    *   Select the `chrome-extension/build/chrome-mv3-dev` folder.

## 🛠️ How to Use

1.  **Login**: Go to `localhost:3000` and sign in with your Google account.
2.  **Upload Resume**: Navigate to the **Resume** tab and upload your CV as a PDF.
3.  **Browse LinkedIn**: Open LinkedIn and find any job post or update.
4.  **Generate**: Click the **📧 Send Email** button that appears on the post.
5.  **Send**: Review the generated draft and click **Send via Gmail**.

## 🧩 System Architecture

- **Next.js (App Router)**: Backend API + User Dashboard.
- **MongoDB**: Storage for user profiles, parsed resume text, and OAuth tokens.
- **Azure OpenAI**: powers the gpt-4o-mini model for personalized email generation.
- **Gmail API**: Securely sends emails with the resume text (and soon attachment) using the user's own account.
- **Plasmo**: Modern framework for building the Chrome Extension content scripts and UI.
