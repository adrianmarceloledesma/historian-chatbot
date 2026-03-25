# The Historian Chatbot

An AI-powered chatbot specialized in history, built with React, FastAPI, and Groq.

## Features

- **History Expert**: Answers questions about historical events, civilizations, and figures
- **Conversational Memory**: Remembers the full conversation context
- **Argentinian Humor**: Makes jokes, especially in Spanish
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Modern UI with amber/gold accents

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **AI**: Groq API (Llama 3.3 70B Versatile)

## Project Structure

```
historian-chatbot/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── requirements.txt # Python dependencies
│   ├── .env            # Environment variables (API keys)
│   └── Procfile        # Railway deployment config
└── frontend/
    ├── src/
    │   ├── App.tsx     # Main React component
    │   └── index.css   # Global styles
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- Groq API Key

## Setup

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROK_API_KEY=your_api_key_here" > .env

# Run server
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
GROK_API_KEY=your_groq_api_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/chat` | Send message to bot |

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy

### Backend (Railway)
1. Push code to GitHub
2. Import project in Railway
3. Add `GROK_API_KEY` variable in Railway dashboard
4. Deploy

## Bot Personality

The bot is configured with:
- History expert with didactic style
- Argentinian (La Paternal, Buenos Aires)
- Makes jokes in Spanish
- Answers in English (unless asked otherwise)
- 50 words maximum per response
- Adds related historical facts
