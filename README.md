# 🤖 AI-Fred: Concurrent Multi-Bot Engine

AI-Fred is a professional, self-hosted WhatsApp automation engine designed to run **multiple accounts simultaneously**. Built with `whatsapp-web.js`, Node.js, and SQLite, it offers a centralized Global Dashboard to monitor and manage all your bots from a single terminal window.

---

## 🚀 Key Features

### 🌐 Concurrent Multi-Bot Architecture
Unlike standard bots, AI-Fred initializes all your WhatsApp sessions **in parallel** on startup. Every bot remains active and responsive in the background while you navigate the dashboard.

### 📊 Global Dashboard & Monitoring
A central command center for all your instances:
- **Live Status:** Monitor bots as they transition between `Waiting for QR`, `Loading`, and `Online`.
- **Real-time Stats:** See contact and message counts for every bot at a glance.
- **Dynamic Refresh:** Press `ENTER` to instantly update the status of all concurrent bots.

### 🛠️ Professional Administrative CLI
Detailed management for each specific instance:
1. **Contact Indexing:** List all registered contacts with names and JIDs.
2. **Conversation History:** View recent messages with bot/user differentiation.
3. **Connection Status:** In-depth technical info about the current session.
4. **Context Switching:** Navigate back to the Global Dashboard without stopping the bot (Option 9).
5. **Session Management:** Easily create new sessions (Option N) or delete old ones (Option D) with full data wipe.

### 🛡️ Anti-Ban & Intelligent UI
- **Per-Bot Privacy:** Toggle **Public** or **Private** (Admin Only) modes independently for each bot.
- **Humanized Presence:** Randomized response delays and simulated "typing..." indicators.
- **Data Isolation:** SQLite database stores data keyed by `bot_id`, ensuring no leaks between accounts.

---

## ⚡ Available Commands
- `/ajuda` - Comprehensive list of available commands.
- `/status` - Detailed system and connection health.
- `/sticker` - Instant image-to-sticker conversion (direct or quoted).
- `/clima [cidade]` - Local weather reports.
- `/resumo` - AI-generated chat summaries (Gemini Integration).

---

## ⚙️ Installation

1. **Clone & Install:**
   ```bash
   git clone [repo-url]
   cd bot-whats
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Add your Google Gemini API Key
   ```

3. **Launch the Engine:**
   ```bash
   npm start
   ```

4. **Multi-Pairing:**
   - Select `N` from the dashboard to add a new session.
   - Enter a name (e.g., `Support`).
   - Select the new session to see the QR Code and link your phone.

---

## 📜 Project Structure
- `src/index.js`: Multi-bot registry, Global Dashboard, and CLI core.
- `src/database.js`: SQLite schema with session isolation and automated migrations.
- `src/commands.js`: Command processing and API integrations.
- `src/utils.js`: Anti-ban humanization logic.

---

## 🤝 Roadmap
- [x] Concurrent Multi-Bot Support
- [x] Global Dashboard UI
- [x] SQLite Data Isolation
- [x] Smart Session Lifecycle (Create/Delete/Back)
- [ ] Voice-to-Text Transcription
- [ ] Intelligent Auto-Replies via AI
- [ ] Image Generation (`/imagine`)

Developed with ❤️ for high-efficiency automation.
