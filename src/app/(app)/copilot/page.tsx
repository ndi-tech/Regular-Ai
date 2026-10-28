"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function CopilotPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am your RegulaGrae-X AI. I have access to your uploaded documents, impact assessments, and tasks. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to get response");
      
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: `Error: ${(error as Error).message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto pb-4">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="text-blue-600 dark:text-blue-400" size={32} />
          Grae-X AI
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Your intelligent compliance assistant. Ask questions based on your organization's documents and data.
        </p>
      </header>

      {/* Chat Window */}
      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-sm' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm whitespace-pre-wrap'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your documents, tasks, or assessments..."
              className="flex-1 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-5 py-3 font-medium hover:opacity-80 disabled:opacity-50 transition flex items-center gap-2"
            >
              <Send size={16} /> <span className="hidden md:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}