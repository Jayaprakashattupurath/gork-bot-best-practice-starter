const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory "session" store for demo only.
// Use Redis or a DB for production.
const sessions = new Map();

function detectIntent(message) {
  const msg = message.toLowerCase();
  if (msg.includes("refund")) return "refund";
  if (msg.includes("password") || msg.includes("login")) return "auth_help";
  return "general";
}

function buildReply(intent) {
  switch (intent) {
    case "refund":
      return "I can help with refunds. Please share your order ID so I can check eligibility.";
    case "auth_help":
      return "For login issues, try resetting your password first. Want me to send reset steps?";
    default:
      return "Thanks! I can help with billing, orders, and account access. What do you need most right now?";
  }
}

app.post("/api/chat", (req, res) => {
  const { sessionId, message } = req.body || {};

  // Basic validation (best practice #1)
  if (!sessionId || !message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid payload: sessionId and message are required." });
  }

  const now = Date.now();
  const history = sessions.get(sessionId) || [];

  // Simple anti-spam check (best practice #2: rate control)
  const recent = history.filter((m) => now - m.timestamp < 5000);
  if (recent.length > 4) {
    return res.status(429).json({
      error: "Too many messages. Please wait a few seconds before sending again."
    });
  }

  const intent = detectIntent(message);
  const botReply = buildReply(intent);

  history.push({ role: "user", text: message, timestamp: now });
  history.push({ role: "bot", text: botReply, timestamp: now + 1 });
  sessions.set(sessionId, history);

  // Small metadata for debugging/observability (best practice #3)
  res.json({
    reply: botReply,
    intent,
    messageCount: history.length
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "gork-bot-api" });
});

app.listen(PORT, () => {
  console.log(`Gork Bot API running at http://localhost:${PORT}`);
});