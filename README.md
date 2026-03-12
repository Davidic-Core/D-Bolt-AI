# D-Bolt-AI

D-Bolt-AI is a modern AI chat web application built with React 18 + TypeScript + Vite. It connects to multiple world-class AI models through the OpenRouter API and provides a clean, developer-focused chat interface with a full set of message management tools.

## Features

### Chat Interface
- **Real-Time Streaming** — Responses stream word-by-word using the OpenRouter API with live UI updates.
- **Copy Messages** — One-click copy to clipboard for any message (user or assistant).
- **Edit User Messages** — Modify any previous user message inline and resend it to the AI.
- **Regenerate Responses** — Re-run any assistant response with full streaming support.
- **Stop Generation** — Interrupt streaming at any time to view partial output.
- **Export Chat** — Download conversations as JSON (structured data) or TXT (readable format).
- **Suggested Prompts** — Empty-state starter prompts to help users begin a conversation.
- **Typing Indicator** — Animated indicator while the AI is generating a response.

### Session & State Management
- **Persistent Sessions** — All conversations, settings, and the active session survive page reloads via Zustand's persist middleware (localStorage key: `d-bolt-ai-storage`).
- **Multi-Session Support** — Create and manage multiple independent chat conversations from the sidebar.

### Interface & UX
- **Sidebar** — Session list with new-chat creation and session switching.
- **Settings Panel** — Configure API key, model, temperature, max tokens, and system prompt.
- **Responsive Layout** — Works on desktop and mobile screens.
- **Dark Theme** — Full dark UI with CSS variable theming.

## Supported AI Models

All models are accessed via [OpenRouter](https://openrouter.ai):

| Provider   | Model              | Notes                                      |
|------------|--------------------|--------------------------------------------|
| OpenAI     | GPT-4o             | Strongest reasoning and code analysis      |
| OpenAI     | GPT-4o Mini        | Fast, affordable for quick iterations      |
| Anthropic  | Claude 3.5 Sonnet  | Excellent for detailed code explanations   |
| Anthropic  | Claude 3 Haiku     | Fast responses for simple tasks            |

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| UI Framework     | React 18 + TypeScript               |
| Build Tool       | Vite                                |
| State Management | Zustand with persist middleware     |
| AI Integration   | OpenRouter API (streaming)          |
| Styling          | Custom CSS with CSS Variables       |
| Markdown         | react-markdown + syntax highlighting |
| Icons            | react-icons (Feather icon set)      |

## Project Structure

```
src/
├── components/
│   ├── ChatArea.tsx      # Main chat logic: streaming, regeneration, export, typing indicator
│   ├── ChatMessage.tsx   # Message rendering with copy, edit, and regenerate controls
│   ├── ChatInput.tsx     # Auto-expanding text input with submission handling
│   ├── Sidebar.tsx       # Session list and new-chat management
│   └── Settings.tsx      # API key, model, temperature, and system prompt configuration
├── store/
│   └── chatStore.ts      # Zustand store with persist middleware
├── types/
│   └── index.ts          # TypeScript interfaces for messages, sessions, settings
├── utils/
│   └── ai.ts             # OpenRouter API integration with streaming support
├── App.tsx               # Root layout: sidebar, topbar, chat area, settings modal
├── App.css               # All component styles
├── index.css             # Global CSS variables, dark theme, scrollbar styles
└── main.tsx              # React entry point
```

## Development

```bash
# Install dependencies
npm install

# Start development server (port 5000)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Configuration

### OpenRouter API Key

1. Get a key from [openrouter.ai/keys](https://openrouter.ai/keys).
2. Open the app and click the **Settings** icon in the sidebar.
3. Paste your key and click **Save Settings**.

The key is stored entirely in your browser's localStorage. It is only ever sent directly to OpenRouter — never to any other server.

## How It Works

### Streaming Message Flow

1. User types a message and presses Enter.
2. The message is added to the active session in the Zustand store.
3. All messages in the session are sent to the OpenRouter API.
4. The response streams in token-by-token, with the UI updating live.
5. On completion, the assistant message is saved to the store (and persisted to localStorage).

### State Persistence

Zustand's persist middleware serializes the following to `localStorage` under the key `d-bolt-ai-storage`:

| Field             | Description                                          |
|-------------------|------------------------------------------------------|
| `sessions`        | All conversations with their full message history    |
| `activeSessionId` | Which conversation is currently displayed            |
| `settings`        | API key, model, temperature, max tokens, system prompt |

UI-only state (`isSettingsOpen`, `isSidebarOpen`) is intentionally not persisted.

## Production Readiness

- Clean TypeScript build with no errors (`npm run build`)
- Zustand persist middleware for durable state across reloads
- Graceful streaming abort handling
- Environment-safe Vite configuration (host `0.0.0.0`, port `5000`, `allowedHosts: all`)

## Contribution Guidelines

- **Branch strategy**: All work on feature branches (`feature/description`), merged to `main` via Pull Request.
- **Main branch**: Protected — no direct commits.
- **TypeScript**: Avoid `any`; keep all interfaces in `src/types/index.ts`.
- **Styling**: Use CSS variables; maintain the dark theme throughout.
- **Components**: Keep components focused and single-responsibility.

## Known Issues

- Clearing browser data will erase all chat history (stored in localStorage).
- Some OpenRouter models may have rate limits or require credits — check your account if you see auth errors.
- Streaming requires a stable connection and JavaScript enabled.

## License

MIT License. See the LICENSE file for details.
