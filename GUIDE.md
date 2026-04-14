# D-Bolt User Guide

A practical guide to getting the most out of D-Bolt — a high-speed, browser-based web coding assistant powered by advanced AI models through OpenRouter.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Image Analysis](#image-analysis)
4. [Chat Features](#chat-features)
5. [Data Management](#data-management)
6. [Deployment](#deployment)

---

## Introduction

D-Bolt is a high-speed web coding assistant that runs entirely in your browser. It connects directly to industry-leading AI models — including GPT-4o and Claude 3.5 Sonnet — through the OpenRouter API, giving you instant access to intelligent code suggestions, explanations, and debugging help without any server-side infrastructure.

Key characteristics:

- **Zero backend** — All processing happens client-side; no data is sent to any server other than OpenRouter
- **Real-time streaming** — Responses appear token-by-token as the model generates them
- **Multi-model** — Switch between models depending on your task without losing your session
- **Persistent** — Conversations are automatically saved in your browser between sessions

---

## Getting Started

### Adding Your API Key

D-Bolt requires an OpenRouter API key to communicate with AI models. The key is stored locally in your browser and never sent anywhere except directly to OpenRouter.

**Step 1 — Obtain an API key**

Visit [openrouter.ai/keys](https://openrouter.ai/keys), sign in, and generate a new key.

**Step 2 — Open Settings**

Click the **Settings** icon (⚙) in the top-right corner of the navbar, or in the bottom-left of the sidebar when inside the chat interface.

**Step 3 — Paste your key**

Paste your OpenRouter API key into the **API Key** field.

**Step 4 — Configure your preferences (optional)**

While in Settings you can also adjust:

| Setting | Description | Default |
|---------|-------------|---------|
| Model | The AI model used for chat responses | GPT-4o |
| Temperature | Controls response creativity (0 = precise, 1 = creative) | 0.7 |
| Max Tokens | Maximum length of each response | 2048 |
| System Prompt | A custom instruction prepended to every conversation | Built-in coding assistant prompt |

**Step 5 — Save**

Click **Save Settings**. Your key and preferences are stored immediately in `localStorage` and persist across sessions.

---

## Image Analysis

The Image Analysis tool lets you upload any visual — a UI screenshot, a wireframe, a diagram, or a mockup — and receive a detailed AI-generated breakdown or code conversion, all without opening a chat session.

### How to Use

1. From the **Home Page**, scroll down to the **Image Analysis** section.
2. **Upload an image** by either:
   - Dragging and dropping it onto the upload zone, or
   - Clicking the zone to open a file browser
3. A preview of your image appears inline once loaded.
4. Click **Analyze Image** to start the analysis.
5. The AI response streams in real time below the image.
6. Click **Copy** to copy the full result to your clipboard.

### Supported Formats & Limits

- **File types:** PNG, JPG, GIF, WebP
- **Maximum size:** 10 MB per image
- **Model used:** Always GPT-4o (vision-capable), regardless of your selected chat model

### Tips

- Upload a screenshot of an existing UI component and ask the model to rewrite it in React + Tailwind CSS
- Drop in a hand-drawn wireframe to get a working HTML/CSS scaffold
- Paste in a diagram or ERD to get a corresponding data model or schema

### Stopping or Resetting

- Click **Stop Analysis** at any time to cancel the streaming request — any partial result is preserved
- Click the **×** button on the image preview to remove the image and start fresh

---

## Chat Features

### Starting a Conversation

1. Navigate to the **Chat** page via the navbar or by clicking **Start Building** / **Open Chat** on the home page.
2. Click **+ New Chat** in the sidebar to start a fresh session.
3. Type your message in the input field at the bottom and press **Enter** (or **Shift+Enter** for a new line).

### Real-Time Streaming

Responses stream token-by-token as the model generates them. A blinking cursor and animated typing indicator confirm that the model is actively responding. You do not need to wait for the full response before reading it.

To stop a response mid-stream, click the **Stop** button that appears in the input area during generation. The partial response is preserved in the conversation.

### Editing Previous Prompts

You can modify any of your previous messages and resubmit them:

1. Hover over the user message you want to change.
2. Click the **Edit** icon that appears.
3. Modify the text inline and press **Enter** to resubmit.

The conversation history is trimmed to the point of the edited message and a new response is generated from that point forward.

### Regenerating Responses

To get a fresh response to any message:

1. Hover over the assistant response you want to regenerate.
2. Click the **Regenerate** icon.

The model reruns from the preceding user message with a new response, streaming in real time.

### Copying Messages

Click the **Copy** icon on any message bubble to copy its full content to your clipboard. A brief **Copied!** confirmation appears on the button.

### Switching Models Mid-Session

Open **Settings** at any time and select a different model from the **Model** dropdown. The new model takes effect from your next message. Previous messages in the session are unaffected.

---

## Data Management

### Session Persistence

All conversations are automatically saved to your browser's `localStorage` under the key `d-bolt-ai-storage`. This means:

- Sessions survive page refreshes and browser restarts
- No account or login is required
- Data is stored only on your device — nothing is uploaded to any server

You can manage your sessions from the **sidebar**: click any session to switch to it, or use the delete control to remove individual conversations.

> **Note:** Clearing your browser's site data or `localStorage` will permanently erase all saved sessions. There is no cloud backup.

### Exporting Conversations

You can download any chat session as a file for archiving or sharing:

1. Open the session you want to export.
2. Click the **Export** icon in the chat toolbar.
3. Choose your format:

| Format | Description |
|--------|-------------|
| **JSON** | Structured export with message roles, content, timestamps, and session metadata |
| **TXT** | Human-readable transcript with speaker labels and line breaks |

The file downloads immediately to your device.

---

## Deployment

D-Bolt is a **fully static web application**. It has no server, no database, and no backend process — every feature runs inside the browser.

This architecture is intentional and designed for speed:

- **Instant startup** — No server cold starts or network round-trips to a backend
- **Zero infrastructure** — Deploy to any static host: Replit, Vercel, Netlify, GitHub Pages, or a CDN
- **Privacy by default** — Your API key and conversations never leave your browser except for direct calls to OpenRouter

### Building for Production

```bash
npm run build     # Compiles TypeScript and bundles assets → dist/
npm run preview   # Serves the production build locally for verification
```

The `dist/` directory contains everything needed to serve the app. Upload it to any static host to deploy.

### Deploying on Replit

1. Open the **Deploy** tab in the Replit workspace.
2. Replit builds and serves the `dist/` directory automatically.
3. A `.replit.app` subdomain with HTTPS is assigned immediately.
4. Re-deploy after any significant code change to push updates to production.
