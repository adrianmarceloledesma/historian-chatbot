# Migración a Render

Completada el 06/07/2026. Se migró de Railway a Render por problemas con la plataforma anterior.

## Configuración en Render

- **Web Service** desde repo `adrianmarceloledesma/historian-chatbot`
- **Root Directory:** `backend` (campo obligatorio — el `main.py` no está en la raíz del repo)
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free ($0)

### Environment Variables
- `GROQ_API_KEY` = `(agregar la key desde Render Dashboard → Environment Variables)`

## Vercel

- `VITE_API_URL` = `https://historian-chatbot.onrender.com/api/chat`

## Wake-up ping (anti-sleep)

Render free tier duerme a los 15 min de inactividad. El frontend tiene un `useEffect` que hace ping a `/health` al montar la app, con reintento cada 5s si falla. Mientras calienta, muestra "Warming up the archives..." en el header.

## Notas
- Free tier duerme a los 15 min de inactividad
- Primer request al despertar tarda ~30s
- Modelo actual: `openai/gpt-oss-120b` (Groq)
