# Anki Cards Generator

A web application that uses AI to generate high-quality Anki flashcards with real-world word usage examples, tips, and nuances — in both your native and target language.

🔗 **Live demo:** [anki-cards-generator.vercel.app](https://anki-cards-generator.vercel.app)

---

## ✨ Features

- 🤖 AI-powered flashcard generation via Google Gemini
- 📝 Usage examples in both native and target language
- 💡 Tips and nuances for each word (connotations, register, common mistakes)
- 🎯 Adjustable difficulty based on your language level
- 📦 Export-ready cards for Anki import

---

## ⚙️ Configuration

Before using the app, you need a **Google Gemini API key**.

Get your free key here: [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)

### Fields

| Field | Description |
|---|---|
| **Native language** | The language you already speak fluently — used for translations and explanations |
| **Language you learn** | The target language for which cards will be generated |
| **Level** | Your proficiency level (A1–C2) — controls the complexity of examples and vocabulary used in generated cards |

---

## 🚀 Usage

### Option 1 — Use online

Just open [anki-cards-generator.vercel.app](https://anki-cards-generator.vercel.app), enter your API key, fill in the fields, and start generating cards.

### Option 2 — Run locally

**Requirements:** [Node.js](https://nodejs.org/) (v18+)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/anki-cards-generator.git
cd anki-cards-generator

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

To create a production build:

```bash
npm run build
npm run preview
```

---

## 🗺️ Roadmap

Planned improvements for future releases:

- 🔊 **Auto-generated audio pronunciation** — via a Node.js script that modifies Anki files directly, with a choice of voice and TTS API provider
- 🌍 **Broader language support** — expand the list of supported native and target languages
- 🧠 **Improved prompts** — better card structure, smarter examples, and more accurate nuance detection
- 🗂️ **Collapsible textarea** — automatically collapse the input area while a card is being generated
- 💾 **Persistent settings** — save the last used language and level configuration in `localStorage`

---

## 🔑 API Key

This app uses the [Google Gemini API](https://aistudio.google.com/api-keys). It has **no backend** — your key is stored in your browser's `localStorage` and never sent to any third-party server.

> ⚠️ **Security notice:** Because there is no backend, the API key is stored in `localStorage` and is more exposed than in a server-side setup. It is strongly recommended to use only **free-tier keys** with no billing attached. The author takes no responsibility for any unauthorized use or charges resulting from a compromised key.
