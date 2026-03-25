# The Historian Chatbot

Trivia-style chatbot application built with React and TypeScript.

The app allows users to chat with an AI specialized in history, ask questions about historical events, civilizations, and figures, and receive educational responses with a touch of humor.

---

## Features

- Chat with an AI history expert
- Full conversation memory
- Argentinian humor and jokes
- Responsive design (mobile-first)
- Dark theme with modern UI
- Instant responses powered by Groq

---

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS
- FastAPI (Python)
- Groq API (Llama 3.3 70B Versatile)
- Python

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/adrianmarceloledesma/historian-chatbot
cd historian-chatbot

# Backend setup
cd backend
pip install -r requirements.txt
echo "GROK_API_KEY=your_api_key" > .env
uvicorn main:app --reload --port 8000

# Frontend setup (in another terminal)
cd frontend
npm install
npm run dev
```

---

## Live Demo

https://historian-chatbot.vercel.app/

---

## Project Structure

```
historian-chatbot/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   ├── .env                # Environment variables
│   └── Procfile            # Railway deployment
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── PROJECT.md         # This file
└── README.md             # Portfolio profile
```

---

## API Endpoints

| Method | Endpoint   | Description          |
|--------|------------|----------------------|
| GET    | `/health`  | Health check         |
| POST   | `/api/chat`| Send message to bot  |

---

## Environment Variables

### Backend (.env)
```
GROK_API_KEY=your_groq_api_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## Bot Personality

- History expert with didactic style
- From La Paternal, Buenos Aires (Argentinian)
- Makes jokes, especially in Spanish
- Answers in English (unless asked otherwise)
- ~50 words maximum per response
- Adds related historical facts to answers
