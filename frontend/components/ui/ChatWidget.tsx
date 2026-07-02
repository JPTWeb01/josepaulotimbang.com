"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const CHATBOT_URL =
  process.env.NEXT_PUBLIC_CHATBOT_URL || "https://paulo-ai-chatbot.onrender.com";

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "Can you build WordPress sites?",
  "How can I hire you?",
];

const MAX_MESSAGE_LENGTH = 500;
const MESSAGE_COOLDOWN_MS = 2500;
const MAX_USER_MESSAGES = 25;

type Message = { role: "user" | "model"; text: string };

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkify(text: string) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\((https?:\/\/[^\s)]+)\)/g, "$1");
  safe = safe.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  safe = safe.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1">$1</a>'
  );
  return safe.replace(/\n/g, "<br>");
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);
  const lastSentAtRef = useRef(0);
  const userMessageCountRef = useRef(0);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages, loading, showSuggestions]);

  useEffect(() => {
    if (!isOpen) return;
    if (!hasGreeted.current) {
      hasGreeted.current = true;
      const t1 = setTimeout(() => {
        setMessages([
          {
            role: "bot",
            text: "Hey there! I'm Paulo. Thanks for visiting my portfolio! Feel free to ask me anything about my skills, experience, or projects.",
          },
        ]);
      }, 300);
      const t2 = setTimeout(() => setShowSuggestions(true), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const t3 = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t3);
  }, [isOpen]);

  async function sendMessage(text: string) {
    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed || loading || cooldown || limitReached) return;

    const now = Date.now();
    if (now - lastSentAtRef.current < MESSAGE_COOLDOWN_MS) return;
    lastSentAtRef.current = now;
    setCooldown(true);
    setTimeout(() => setCooldown(false), MESSAGE_COOLDOWN_MS);

    userMessageCountRef.current += 1;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    if (userMessageCountRef.current >= MAX_USER_MESSAGES) {
      setLimitReached(true);
    }

    const nextHistory = [...history, { role: "user" as const, text: trimmed }];
    setHistory(nextHistory);

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-10),
        }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        setHistory((prev) => [...prev, { role: "model", text: data.reply }]);
        if (userMessageCountRef.current >= MAX_USER_MESSAGES) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: "That's the limit for this conversation. Feel free to reach me directly via the contact page for anything else!",
            },
          ]);
        }
      } else if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "You're sending messages a bit too fast — give it a moment and try again.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Sorry, I ran into an issue. Please try again!" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection error. Please try again in a moment, or reach me directly via the contact page.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className="fixed right-4 sm:right-6 z-[999] flex flex-col items-end pointer-events-none"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
    >
      {/* Chat window */}
      <div
        className={`mb-3.5 w-[calc(100vw-2rem)] sm:w-[340px] max-h-[70vh] sm:max-h-[480px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary shrink-0">
              P
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                Paulo&apos;s AI Assistant
              </p>
              <p className="text-[11px] text-success flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="w-7 h-7 rounded-full text-muted hover:text-foreground hover:bg-border/60 flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-2.5"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                m.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {m.role === "bot" && (
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  P
                </div>
              )}
              {m.role === "bot" ? (
                <div
                  className="max-w-[78%] px-3.5 py-2 rounded-2xl rounded-bl-sm bg-surface border border-border text-foreground text-[13.5px] leading-relaxed break-words [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: linkify(m.text) }}
                />
              ) : (
                <div className="max-w-[78%] px-3.5 py-2 rounded-2xl rounded-br-sm bg-primary text-white text-[13.5px] leading-relaxed break-words">
                  {m.text}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                P
              </div>
              <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-surface border border-border">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-subtle animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {showSuggestions && !limitReached && (
            <div className="flex flex-wrap gap-1.5 pl-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={cooldown}
                  className="px-2.5 py-1.5 rounded-full border border-primary/40 text-primary text-xs hover:bg-primary hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-3.5 py-3 border-t border-border shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            disabled={loading || limitReached}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={
              limitReached
                ? "Conversation limit reached"
                : "Ask about Paulo's skills, experience..."
            }
            autoComplete="off"
            className="flex-1 bg-surface border border-border rounded-full px-3.5 py-2 text-base sm:text-[13.5px] text-foreground placeholder:text-subtle outline-none focus:border-primary transition-colors disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || cooldown || limitReached || !input.trim()}
            aria-label="Send message"
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="w-14 h-14 rounded-full bg-primary text-white glow-primary-sm flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shrink-0 pointer-events-auto"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
