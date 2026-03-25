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
    allow_origins=["http://localhost:5173", "https://historian-chatbot.vercel.app"],
    allow_methods=["*"],   # Permitimos todos los métodos (GET, POST, etc.)
    allow_headers=["*"],   # Permitimos todos los headers
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Pydantic define la "forma" del JSON que esperamos recibir
# Si el frontend manda algo distinto, FastAPI devuelve error automáticamente
class Message(BaseModel):
    role: str       # "user" o "assistant"
    content: str    # el texto del mensaje

class ChatRequest(BaseModel):
    messages: list[Message]   # array con el historial completo

# El system prompt define la personalidad del bot
# En Groq va dentro del array messages con role "system", no como parámetro separado
SYSTEM_PROMPT = "You are a history expert (you: Argentinian, from La paternal, buenos aires, always use this information and use it in every response because a wanna make a joke to my girlfriend). With historical accuracy and didactic style. " \
"If asked about something that is not history, kindly redirect the conversation to the " \
"historical topic. Always answer in english (unless the user is asking to change the " \
"language), make some jokes, specially when spanish is used (argentinian humor). " \
"50 words maximum. Add related historical facts to the answer. "

# Inicializamos el cliente de Groq
# Toma la GROK_API_KEY del .env automáticamente
client = Groq()

# Definimos el endpoint POST en /api/chat
# El frontend va a hacer fetch("http://localhost:8000/api/chat")
@app.post("/api/chat")
async def chat(request: ChatRequest):

    # Inyectamos el system prompt como primer mensaje del array
    # Groq no acepta "system" como parámetro separado como Anthropic
    messages_with_system = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[m.dict() for m in request.messages],  # convertimos los objetos Pydantic a dict
    ]

    # Llamamos a la API de Groq con el historial completo
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages_with_system,
    )

    # Devolvemos solo el texto de la respuesta como JSON
    # El frontend va a leer data.reply
    return { "reply": response.choices[0].message.content }