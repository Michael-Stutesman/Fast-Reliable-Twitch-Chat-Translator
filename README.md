# 🌐 Twitch Chat Translator

⚡ A lightweight **Chrome/Edge extension** that automatically translates Twitch chat messages in real time.  
🌍 Designed for stream viewers who enjoy international communities and want translations without leaving Twitch.

---

# ✨ Features

💬 Real-time Twitch chat translation  
🌎 Supports 20+ languages  
🧠 Auto language detection  
⚡ Instant language switching  
📦 Efficient batched translation requests  
👁️ Smart viewport detection  
🔄 Automatic Twitch navigation handling  
📜 Preserves chat scrolling behavior  
🎛️ Enable/disable translation with one click  
🪶 Low CPU and memory usage  

---

# 🌍 Supported Languages

🤖 Auto Detect  
🇺🇸 English  
🇪🇸 Spanish  
🇵🇹 Portuguese  
🇧🇷 Portuguese (Brazil)  
🇫🇷 French  
🇩🇪 German  
🇮🇹 Italian  
🇳🇱 Dutch  
🇷🇺 Russian  
🇵🇱 Polish  
🇹🇷 Turkish  
🇸🇦 Arabic  
🇮🇳 Hindi  
🇵🇰 Urdu  
🇮🇩 Indonesian  
🇻🇳 Vietnamese  
🇹🇭 Thai  
🇰🇷 Korean  
🇯🇵 Japanese  
🇨🇳 Chinese (Simplified)  
🇹🇼 Chinese (Traditional)  

---

# ⚙️ How It Works

🧩 Watches Twitch chat for new messages and translates them automatically using a translation service.

📦 Messages are grouped into batches to improve performance:
- Reduces network requests  
- Handles fast-moving chats efficiently  

👁️ Only visible or near-visible messages are processed  
→ avoids unnecessary work on off-screen content  

---

# 🚀 Performance Optimizations

## 📦 Batched Processing
- Batch Size: 12 messages  
- Parallel Batches: 6  
- Batch Window: 50ms  

---

## 👁️ Viewport Intelligence
Only translates messages that are:
- Visible on screen  
- Near the chat viewport  

---

## 🔄 Smart Scroll Preservation
- Follows chat when user is at bottom  
- Pauses when user scrolls up  
- Resumes automatically  

---

## 🌐 Dynamic Twitch Navigation Support
- Detects Twitch SPA navigation  
- Reconnects automatically  
- No refresh required  

---

# 📥 Installation

## 🧑‍💻 Developer Mode (Chrome / Edge)

1. Download or clone this repository  
2. Open Chrome / Edge  
3. Go to: chrome://extensions
4. Enable **Developer Mode** 🧪  
5. Click **Load Unpacked** 📦  
6. Select the extension folder  
7. Open Twitch and start using it 🎉  

---

# 🎮 Usage

1. Open any Twitch stream  
2. Click the extension icon 🧩  
3. Select your target language 🌍  
4. Click **Enable Translation**  
5. Watch chat translate in real time ⚡  

---

# 🔐 Permissions

## 💾 Storage Access
Stores:
- Language preferences  
- Enabled state  

## 🌐 Twitch Page Access
Allows:
- Reading chat messages  
- Injecting translations  

---

# 📁 Project Structure Twitch-Chat-Translator/
├── manifest.json
├── popup.html
├── styles.css
├── README.md
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── js/
    ├── popup.js
    ├── content.js
    └── background.js

---

# 📝 Notes

⚠️ Works only on Twitch  
⏳ Existing messages are not translated retroactively  
🌐 Translation quality depends on external service  
🧪 Intended for personal use, learning, and community interaction  

---

# 📜 License

MIT License

You are free to:
- Use  
- Modify  
- Distribute  

With attribution.
