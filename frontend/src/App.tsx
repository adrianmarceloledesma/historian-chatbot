import { useState, useRef, useEffect } from "react";

// Definimos el tipo Message con TypeScript
// Así el editor nos avisa si mandamos un role incorrecto
interface Message {
  role: "user" | "assistant"; // solo puede ser uno de estos dos valores
  content: string;
}

export default function App() {

  // --- ESTADO ---

  // Historial completo de mensajes. Arranca vacío.
  const [messages, setMessages] = useState<Message[]>([]);

  // Lo que el usuario está escribiendo en el input
  const [input, setInput] = useState("");

  // true mientras esperamos respuesta del backend
  const [loading, setLoading] = useState(false);

  // --- REF ---

  // Referencia al div invisible al final de los mensajes
  // Lo usamos para hacer scroll automático hacia abajo
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- EFECTO ---

  // Se ejecuta cada vez que cambia el array "messages"
  // Hace scroll suave al último mensaje automáticamente
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNCIÓN PRINCIPAL ---

  async function handleSend() {
    // No hacemos nada si el input está vacío o ya hay un request en curso
    if (!input.trim() || loading) return;

    // Creamos el mensaje del usuario
    const userMessage: Message = { role: "user", content: input };

    // Agregamos el mensaje nuevo al historial existente
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages); // actualizamos la UI con el mensaje del user
    setInput("");                 // limpiamos el input
    setLoading(true);             // activamos el indicador de carga

    try {
      // Llamamos al backend Python (FastAPI en puerto 8000)
      // Mandamos el historial COMPLETO para que el bot recuerde la conversación
        const res = await fetch(import.meta.env.VITE_API_URL || "http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      // Convertimos la respuesta a JSON
      const data = await res.json();

      // Agregamos la respuesta del bot al historial
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);

    } catch {
      // Si el backend no responde, mostramos un mensaje de error en el chat
      setMessages([...updatedMessages, { role: "assistant", content: "Error al conectar con el servidor." }]);

    } finally {
      // Siempre desactivamos el loading, tanto en éxito como en error
      setLoading(false);
    }
  }

  // Enviar con Enter (pero no con Shift+Enter, que sería salto de línea)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // --- RENDER ---

  return (
    // Fondo gris, centrado vertical y horizontal
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {/* Contenedor principal: blanco, redondeado, sombra, altura fija */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col h-[600px]">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Historian Chatbot</h1>
          <p className="text-sm text-gray-400">Ask me anything about history</p>
        </div>

        {/* ÁREA DE MENSAJES */}
        {/* flex-1 hace que ocupe todo el espacio disponible entre header y footer */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">

          {/* Placeholder cuando no hay mensajes todavía */}
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-16">
              Write something to start...
            </p>
          )}

          {/* Renderizamos cada mensaje */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "self-end bg-blue-500 text-white"      // usuario: derecha, azul
                  : "self-start bg-gray-100 text-gray-800" // bot: izquierda, gris
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* Indicador de "escribiendo..." mientras carga */}
          {loading && (
            <div className="self-start bg-gray-100 text-gray-400 px-4 py-2 rounded-2xl text-xl tracking-widest">
              ···
            </div>
          )}

          {/* Div invisible — el scroll automático apunta acá */}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)} // actualiza el estado con cada tecla
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            disabled={loading} // deshabilitado mientras espera respuesta
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-40 transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}