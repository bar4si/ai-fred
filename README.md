# 🤖 AI-Fred: Concurrent Multi-Bot Engine

AI-Fred is a professional-grade, self-hosted WhatsApp automation engine designed to orchestrate **multiple accounts simultaneously**. Engineered with a modular, senior-level architecture, it leverages `whatsapp-web.js`, Node.js, and Google Gemini to provide a centralized hub for high-efficiency communication.

---

## 📑 Table of Contents
1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Dependency Injection](#3-architecture--dependency-injection)
4. [Concurrent Multi-Bot Core](#4-concurrent-multi-bot-core)
5. [API & Remote Control](#5-api--remote-control)
6. [Commands & Usage Examples](#6-commands--usage-examples)
7. [Installation & Configuration](#7-installation--configuration)
8. [Advanced Roadmap](#8-advanced-roadmap)

---

## 1. Overview
**AI-Fred** is a professional-grade assistant designed for high-availability WhatsApp automation. It focuses on stability, multi-account management, and seamless AI integration, making it ideal for both personal assistance and business workflows.

---

## 2. Technology Stack
Built with modularity and performance in mind:
- **Runtime:** `Node.js (v18+)`
- **Provider:** `whatsapp-web.js` (Stable browser-level integration)
- **Database:** `SQLite` (Lightweight persistence)
- **Intelligence:** `Google Gemini API` (Advanced NLP and audio transcription)

---

## 3. Architecture & Dependency Injection
The engine uses a **Dependency Injection** pattern to remain provider-agnostic. Commands, handlers, and even the WhatsApp provider (WWebJS vs. Official API) can be swapped or extended without modifying the core logic.

---

## 4. Concurrent Multi-Bot Core
AI-Fred supports **true concurrency**. Each bot instance runs in its own Puppeteer process, managed by a central `BotManager`.
- **Isolation:** Sessions are stored in independent folders (`.wwebjs_auth/session-[id]`).
- **Dynamics:** Add or remove bots in real-time via API or CLI without restarting the master process.

---

## 5. API & Remote Control
AI-Fred exposes a **Secured REST API** for external control and includes a dedicated **Console Client**.

- **API Server:** Starts naturally on port `3000`.
- **Authentication:** All requests must include the `x-api-key` header.
- **Endpoints:**
  - `GET /status`: Real-time status, statistics, transcription state, and privacy mode.
  - `GET /qr/:botId`: Fetch QR Code string for pending sessions.
  - `POST /create-bot`: Dynamically initialize a new bot session (Puppeteer instance).
  - `POST /toggle-privacy`: Switch between Public and Private modes.
  - `POST /send-message`: Send manual messages through any online bot.

---

## 6. Commands & Usage Examples
| Command | Action | Example |
| :--- | :--- | :--- |
| `/ajuda` | Displays the command menu | `User: /ajuda` |
| `/fred [prompt]` | Direct AI interaction (Gemini) | `User: /fred how are you?` |
| `/audio [on/off]` | Toggle automatic voice transcription | `User: /audio on` |
| `/status` | Connection and per-bot metrics | `User: /status` |
| `/sticker` | Convert image to sticker | `(on image caption): /sticker` |

---

## 7. Installation & Configuration
Both `back/` and `cli-fred/` use `.env` files for configuration.

**Backend (.env):**
```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
API_KEY=fred_secret_key_2024
```

**Console Client (cli-fred/.env):**
```env
API_URL=http://localhost:3000
API_KEY=fred_secret_key_2024
```

To start the dashboard client:
```bash
cd cli-fred
node index.js
```

---

## 8. Advanced Roadmap
Beyond the core engine, AI-Fred is evolving with high-performance utilities:

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Sticker Maker** | Instant image-to-sticker conversion | ✅ |
| **Audio Intelligence** | Real-time transcription using Gemini | ✅ |
| **Secured API** | Express-based remote control with API Key | ✅ |
| **CLI Dashboard** | Interactive multi-bot management console | ✅ |
| **Educational Assistant** | Interactive quiz collection for students | ⏳ |
| **Media Downloader** | Download videos from social media | 📅 |
| **Dynamic Resumes** | AI-Powered chat summarization | 📅 |
| **WebShot** | Real-time website screenshots | 📅 |

---
