# PlayinGrocery 🛒

AI-powered grocery planner for students. Enter your country, get a weekly meal plan, grocery list, and budget tips — powered by 4 AI agents.

## Tech Stack

- **Frontend** — React + Vite
- **Backend** — Node.js + Express
- **AI** — Groq (free)

## Setup

### 1. Get a free Groq API key
Go to [console.groq.com](https://console.groq.com) → sign up → create API key

### 2. Backend
```bash
cd backend
npm install
npx playwright install chromium
cp .env.example .env
# Add your Groq key to .env
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```
GROQ_API_KEY=your_key_here
PORT=3001
```

## Deploy

- **Frontend** → [Vercel](https://vercel.com) — import repo, set root to `frontend`
- **Backend** → [Render](https://render.com) — import repo, set root to `backend`, add `GROQ_API_KEY` in environment variables

## Features

- 🌍 Works for any country
- 🤖 4 AI agents working together
- 🎓 Student mode for tight budgets
- 📋 Interactive grocery checklist
- 💰 Budget optimizer with store rankings
