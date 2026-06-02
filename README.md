Twitch Chat Translator
A lightweight Chrome/Edge extension that automatically translates Twitch chat messages in real time.
Designed for stream viewers who enjoy international communities and want translated chat without leaving Twitch.
Features

Real-time Twitch chat translation
Supports 20+ languages
Auto language detection
Instant language switching
Efficient batched translation requests
Smart viewport detection
Automatic Twitch navigation handling
Preserves chat scrolling behavior
Enable/disable translation with one click
Low CPU and memory usage

Supported Languages

Auto Detect
English
Spanish
Portuguese
Portuguese (Brazil)
French
German
Italian
Dutch
Russian
Polish
Turkish
Arabic
Hindi
Urdu
Indonesian
Vietnamese
Thai
Korean
Japanese
Chinese (Simplified)
Chinese (Traditional)

How It Works
The extension watches Twitch chat for new messages and automatically translates them using Google's public translation endpoint.
Messages are collected into small batches before being translated. This reduces network overhead and improves performance during fast-moving chats.
Only messages that are visible (or about to become visible) are translated, preventing wasted work on messages the user will never see.
Performance Optimizations
Batched Processing
Instead of translating every message individually, messages are grouped into batches.
Default settings:

Batch Size: 12 messages
Parallel Batches: 6
Batch Window: 50ms

Viewport Intelligence
Messages are only translated when:

Visible on screen
Near the visible chat area

This significantly reduces translation requests in high-volume channels.
Smart Scroll Preservation
The extension preserves Twitch's natural scrolling behavior:

Follows chat when at the bottom
Temporarily pauses auto-follow when the user scrolls
Automatically resumes when appropriate

Dynamic Twitch Navigation Support
The extension detects Twitch's single-page navigation system and automatically reconnects when changing channels without requiring a page refresh.
Installation
Developer Installation


Download or clone this repository.


Open Chrome or Edge.


Navigate to:


chrome://extensions


Enable:

Developer Mode


Click:

Load Unpacked



Select the extension folder.


Open Twitch and begin using the extension.


Usage

Open any Twitch stream.
Click the extension icon.
Select your target language.
Click Enable Translation.
Incoming chat messages will be translated automatically.

Language changes take effect instantly.
Permissions
The extension requires:


Storage access

Saves language preferences and enabled state.



Twitch page access

Reads and updates Twitch chat messages.



Twitch-Chat-Translator/
├── manifest.json
├── popup.html
├── styles.css
├── js/
│   ├── popup.js
│   ├── content.js
│   └── background.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md

Notes

Works only on Twitch.
Existing messages are not retroactively translated.
Translation quality depends on the underlying translation service.
Intended for personal use, language learning, and community participation.

License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software with attribution.