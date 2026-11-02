import React, { useMemo, useState } from "react";
import { sendMessage } from "./api";

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function App() {
  const sessionId = useMemo(() => `session_${uid()}`, []);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I’m Gork Bot. Ask me about refunds, login issues, or billing." }
  ]);

  async function onSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    // optimistic UI (best practice #4)
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsSending(true);

    try {
      const data = await sendMessage({ sessionId, message: text });
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Sorry, I hit an issue: ${err.message}` }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Gork Bot Best Practice Demo</h1>

      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, minHeight: 280 }}>
        {messages.map((m, i) => (
          <p key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
            <strong>{m.role === "user" ? "You" : "Gork Bot"}:</strong> {m.text}
          </p>
        ))}
        {isSending && <p><em>Gork Bot is typing...</em></p>}
      </section>

      <form onSubmit={onSend} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={isSending}>
          Send
        </button>
      </form>
    </main>
  );
}