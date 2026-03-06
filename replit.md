# D-Bolt-AI

An AI-powered coding assistant web application built with React, TypeScript, and Vite.

## Overview

D-Bolt-AI is a chat interface that connects to multiple AI models via the OpenRouter API. Users can have conversations with AI assistants focused on coding help, get syntax-highlighted code responses, and configure their preferred model and settings.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand
- **AI API**: OpenRouter (supports GPT-4, Claude, Gemini, Llama, DeepSeek, and more)
- **Markdown Rendering**: react-markdown with remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter (Prism, vscDarkPlus theme)
- **Icons**: react-icons (Feather Icons)

## Project Structure

```
src/
  components/
    Sidebar.tsx       - Chat session list and navigation
    ChatArea.tsx      - Main chat view with message streaming
    ChatMessage.tsx   - Individual message with markdown/code rendering
    ChatInput.tsx     - Text input with send/stop controls
    Settings.tsx      - Settings modal (API key, model, temperature, etc.)
  store/
    chatStore.ts      - Zustand store for sessions, messages, settings
  types/
    index.ts          - TypeScript types (Message, ChatSession, AppSettings)
  utils/
    ai.ts             - OpenRouter streaming API integration, model list
  App.tsx             - Root component with layout
  App.css             - All component styles
  index.css           - Global styles and CSS variables
  main.tsx            - React entry point
```

## Running

```bash
npm run dev    # Dev server on port 5000
npm run build  # Production build to dist/
```

## Configuration

- Dev server: port 5000, host 0.0.0.0
- HMR: WSS on clientPort 443 (Replit proxy compatible)
- Deployment: Static site via `npm run build` → `dist/`

## Features

- Multiple AI model support via OpenRouter
- Streaming responses with real-time typing effect
- Syntax-highlighted code blocks with copy button
- Multiple chat sessions with sidebar navigation
- Configurable system prompt, temperature, max tokens
- Dark theme throughout
- Stop generation button
- Responsive layout with collapsible sidebar
