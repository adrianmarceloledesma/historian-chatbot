import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="min-h-screen flex flex-col">
      
      {/* Header - Fixed on mobile */}
      <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🏛️</span>
          <h1 className="text-xl font-serif font-bold text-amber-400">The Historian</h1>
          <span className="text-2xl">📜</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col pb-20">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <span className="text-4xl">🏛️</span>
              </div>
              <p className="text-gray-300 font-serif text-base">
                Greetings, traveler. What history shall we explore today?
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Ask about ancient civilizations, famous events, or historical figures
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="message-enter flex"
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-5 py-4 rounded-2xl border border-gray-700">
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
      </main>

      {/* Input Area - Fixed bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-3 py-3">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about history..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
