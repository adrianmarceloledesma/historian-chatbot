import { useState, useRef, useEffect } from "react";
import { Landmark, ScrollText, Send } from "lucide-react";

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
        <div className="text-center py-3 md:py-5 px-4">
          <div className="inline-flex items-center gap-1.5 md:gap-3">
            <Landmark className="w-5 h-5 md:w-8 md:h-8 text-gold drop-shadow-sm" />
            <h1 className="text-xl md:text-3xl font-serif font-bold text-gold tracking-wide" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}>
              The Historian
            </h1>
            <ScrollText className="w-5 h-5 md:w-8 md:h-8 text-gold drop-shadow-sm" />
          </div>
          <p className="text-sepia text-xs md:text-sm font-serif italic flex items-center justify-center gap-2 mt-1">
            {serverReady ? (
              <>Your AI companion through the ages</>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Warming up the archives...
              </span>
            )}
          </p>
          {/* Decorative divider */}
          <div className="flex items-center gap-2 mt-2 md:mt-3 px-12 md:px-20">
            <div className="flex-1 h-px bg-sepia/30" />
            <div className="w-1 md:w-1.5 h-1 md:h-1.5 rotate-45 bg-gold/60" />
            <div className="flex-1 h-px bg-sepia/30" />
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-parchment rounded-2xl shadow-lg flex flex-col overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Landmark className="w-9 h-9 text-gold/70" />
                </div>
                <p className="text-ink font-serif text-lg font-medium">
                  Greetings, traveler. What history shall we explore today?
                </p>
                <p className="text-sepia text-sm mt-2">
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
                      ? "bg-gradient-to-r from-gold to-gold-light text-ink font-medium shadow-md"
                      : "bg-parchment-light text-ink border border-sepia/20 shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-parchment-light px-5 py-4 rounded-2xl border border-sepia/20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-sepia loading-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-sepia loading-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-sepia loading-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-5 border-t border-sepia/20 bg-parchment-dark/50">
            <div className="flex gap-2 md:gap-3">
              <input
                className="flex-1 bg-parchment-dark border border-sepia/30 rounded-xl px-4 md:px-5 py-3 text-ink placeholder-sepia/60 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all min-w-0 font-serif"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={serverReady ? "Ask about history..." : "Warming up..."}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-gold to-gold-light text-ink px-3 md:px-6 py-3 rounded-xl font-semibold hover:from-gold-light hover:to-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

   
      </div>
    </div>
  );
}
