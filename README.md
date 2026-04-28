# Aegis SOS

**Emergency alert and SOS dispatch app for the general public in hospitality.**

> Built at Hack2Skill Google Solutions Challenge · Submitted on 28th April 

---

## The Problem

Emergency response in hospitality environments is often limited by the quality of the initial report.

Information is typically incomplete, inconsistent, or delayed, forcing staff and responders to verify details before acting. This introduces a gap between incident occurrence and coordinated response.

## What Aegis SOS Does

Aegis SOS is a web-based system for generating and distributing structured emergency alerts without requiring installation. It accepts free-form input, converts it into a consistent, actionable format, and dispatches it in real time to relevant parties. The system reduces ambiguity at the point of reporting, allowing response to begin with usable information.

## Features

- AI-assisted alert composition using Google Gemini
- SMS dispatch via Twilio so alerts reach people off-platform
- Real-time alert storage and retrieval via Supabase
- Geolocation capture attached to every alert
- No account required to send an SOS
- Runs in any modern browser — no installation needed

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini (`@google/generative-ai`) |
| Database / Backend | Supabase |
| SMS Dispatch | Twilio |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Twilio account with a phone number
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/shaundx/aegis-sos.git
cd aegis-sos
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
aegis-sos/
├── app/           Next.js App Router pages and API routes
├── public/        Static assets
└── ...config      Next.js, TypeScript, ESLint, PostCSS, Tailwind config
```

## Demo

[Live demo link — add before submission]

[Screenshot or screen recording — add before submission]

## Team

[Add team member names and roles]

## License

MIT
