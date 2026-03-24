# Cargamos las variables de entorno del archivo .env (la API key)
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq 

# Inicializamos la app de FastAPI
# Es el equivalente a "const app = express()" en Node
app = FastAPI()

# Configuramos CORS para que el frontend React (puerto 5173)
# pueda hacer requests a este backend (puerto 8000)
# Sin esto, el browser bloquea las requests por seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],   # Permitimos todos los métodos (GET, POST, etc.)
    allow_headers=["*"],   # Permitimos todos los headers
)

# Pydantic define la "forma" del JSON que esperamos recibir
# Si el frontend manda algo distinto, FastAPI devuelve error automáticamente
class Message(BaseModel):
    role: str       # "user" o "assistant"
    content: str    # el texto del mensaje

class ChatRequest(BaseModel):
    messages: list[Message]   # array con el historial completo

# Inicializamos el cliente de Groq
# Toma la GROK_API_KEY del .env automáticamente
client = Groq()

# Definimos el endpoint POST en /api/chat
# El frontend va a hacer fetch("http://localhost:8000/api/chat")
@app.post("/api/chat")
async def chat(request: ChatRequest):

    # Llamamos a la API de Groq con el historial completo
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[m.dict() for m in request.messages],  # convertimos los objetos Pydantic a dict
    )

    # Devolvemos solo el texto de la respuesta como JSON
    # El frontend va a leer data.reply
    return { "reply": response.choices[0].message.content }