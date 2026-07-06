import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace("/api/chat", "")
      : "http://localhost:8000";

    const wakeUp = (): void => {
      fetch(`${baseUrl}/api/ping`)
        .then(() => setServerReady(true))
        .catch(() => setTimeout(wakeUp, 5000));
    };
    wakeUp();
  }, []);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL || "http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Error al conectar con el servidor." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-4xl flex flex-col h-[95vh] md:h-[85vh] max-h-[800px]">
        
        {/* Header */}
        <div className="text-center py-2 md:py-6 px-4">
          <div className="inline-flex items-center gap-1 md:gap-3">
            <span className="text-2xl md:text-4xl">🏛️</span>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-amber-400 tracking-wide">
              The Historian
            </h1>
            <span className="text-2xl md:text-4xl">📜</span>
          </div>
          <p className="text-gray-400 text-xs md:text-base font-serif italic flex items-center justify-center gap-2">
            {serverReady ? (
              <>Your AI companion through the ages</>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Warming up the archives...
              </span>
            )}
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 mt-2 md:mt-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <span className="text-5xl">🏛️</span>
                </div>
                <p className="text-gray-400 font-serif text-lg">
                  Greetings, traveler. What history shall we explore today?
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Ask me about ancient civilizations, famous events, or historical figures
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-enter flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium shadow-lg shadow-amber-500/20"
                      : "bg-gray-800/80 text-gray-100 border border-gray-700/50"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 px-5 py-4 rounded-2xl border border-gray-700/50">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 loading-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 loading-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 loading-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-5 border-t border-gray-700/50 bg-gray-900/30">
            <div className="flex gap-2 md:gap-3">
              <input
                className="flex-1 bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 md:px-5 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={serverReady ? "Ask about history..." : "Warming up the server..."}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 px-3 md:px-6 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

   
      </div>
    </div>
  );
}
