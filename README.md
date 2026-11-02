# Gork Bot Best Practice (Node + React)

A small, practical starter showing how to build a **real-time customer support bot flow** with lightweight best practices.

## Real-world use case

Imagine an e-commerce support widget where users ask:
- “How do I get a refund?”
- “I can’t log in”
- “Where is my order?”

This starter demonstrates the core pattern:
1. React chat UI collects user messages.
2. Node API validates input and applies basic anti-spam control.
3. API returns intent-driven replies.
4. UI handles optimistic updates + failure states cleanly.

---

## What this project includes

- **Node/Express backend** (`src/server.js`)
  - Input validation
  - Basic in-memory session history
  - Simple rate limiting behavior
  - Intent detection and guided responses
- **React frontend** (`src/client/App.jsx`)
  - Chat interface
  - Optimistic UI
  - Loading/typing indicator
  - Error handling for API failures

---

## Why this is “best practice” (lightweight version)

1. **Validate every request**  
   Prevent malformed payloads from crashing logic.

2. **Add rate control early**  
   Even basic anti-spam checks reduce abuse and protect UX.

3. **Return metadata for observability**  
   Intent and message counts help debugging and analytics.

4. **Use optimistic UX with safe fallback**  
   Users see immediate feedback, while errors remain understandable.

5. **Separate client API layer**  
   `src/client/api.js` keeps fetch logic out of UI components.

---

## Project structure

- `src/server.js` – Express API
- `src/client/App.jsx` – Chat UI
- `src/client/api.js` – Client-side API wrapper
- `src/client/main.jsx` – React entry point
- `index.html` – Vite root HTML
- `package.json` – scripts and dependencies

---

## Run locally

```bash
npm install
npm run dev
```

- React app runs with Vite (default `http://localhost:5173`)
- Node API runs on `http://localhost:4000`

---

## Example test flow

1. Open the app.
2. Send: `I need a refund`.
3. Bot replies with refund guidance.
4. Send many messages quickly to trigger rate-limit response.
5. Observe friendly error text in chat.

---

## Next improvements for production

- Replace in-memory sessions with Redis/Postgres
- Add authentication and tenant/user identity
- Add structured logs + tracing
- Add policy/safety filters and profanity handling
- Integrate real LLM/provider with prompt templates
- Add feedback buttons (“Was this helpful?”) and analytics dashboards

---

## Notes

This code is intentionally small and easy to extend.  
It is designed for learning and rapid prototyping, not as a full production bot platform.