# Replit Development Guide — D-Bolt-AI

Reference document for developing and running D-Bolt-AI on Replit. Covers architecture, state management, API integration, and workflow conventions.

## Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start dev server on port 5000
npm run build     # Production build → dist/
npm run preview   # Preview the production build
```

The app is served on port `5000` and accessed via the Replit proxy in the preview pane.

---

## Architecture Overview

### Stack

| Layer            | Technology                              |
|------------------|-----------------------------------------|
| UI Framework     | React 18 + TypeScript                   |
| Build Tool       | Vite (port 5000, host 0.0.0.0)          |
| State Management | Zustand with persist middleware         |
| AI Backend       | OpenRouter API — `src/utils/ai.ts`      |
| Styling          | Custom CSS + CSS Variables (dark theme) |

### Component Map

```
App.tsx
├── Sidebar.tsx          — Session list, new-chat button
├── ChatArea.tsx         — Core chat logic, streaming, export, typing indicator
│   ├── ChatMessage.tsx  — Per-message UI: copy, edit, regenerate controls
│   └── ChatInput.tsx    — Text input with auto-height and send handling
└── Settings.tsx         — Modal: API key, model, temperature, system prompt
```

### Key Files

| File                    | Responsibility                                           |
|-------------------------|----------------------------------------------------------|
| `src/App.tsx`           | Root layout; wires sidebar, topbar, chat area, settings  |
| `src/store/chatStore.ts`| Zustand store — all app state + persist middleware       |
| `src/utils/ai.ts`       | OpenRouter streaming API call; handles abort controller  |
| `src/types/index.ts`    | TypeScript interfaces: Message, Session, Settings        |
| `src/App.css`           | All component styles                                     |
| `src/index.css`         | CSS variables, global dark theme, scrollbar styles       |

---

## State Management

### Zustand Store (`src/store/chatStore.ts`)

All state lives in a single Zustand store with two layers:

**Persisted state** — automatically written to `localStorage` under the key `d-bolt-ai-storage`:

| Field             | Type       | Description                              |
|-------------------|------------|------------------------------------------|
| `sessions`        | `Session[]`| All conversations with full message history |
| `activeSessionId` | `string`   | ID of the currently displayed session    |
| `settings`        | `Settings` | API key, model, temperature, max tokens, system prompt |

**Non-persisted state** — in-memory only, resets on page load:

| Field             | Type      | Description                    |
|-------------------|-----------|--------------------------------|
| `isSettingsOpen`  | `boolean` | Controls settings modal        |
| `isSidebarOpen`   | `boolean` | Controls sidebar open/closed   |

The `partialize` option on the persist middleware ensures only the three persisted fields are written to localStorage — never the UI state.

### localStorage Key

```
d-bolt-ai-storage
```

Inspect or clear this in DevTools → Application → Local Storage.

---

## API Integration

### OpenRouter (`src/utils/ai.ts`)

All AI requests go through `https://openrouter.ai/api/v1/chat/completions` with streaming enabled.

- **Streaming**: Uses the `ReadableStream` / `fetch` API with `stream: true`. Tokens update the UI in real time.
- **Abort**: An `AbortController` ref in `ChatArea.tsx` handles the Stop Generation feature.
- **Error handling**: Network and API errors surface with a user-visible message in the chat area.

### API Key

The OpenRouter API key is entered by the user in the Settings panel and stored in Zustand's persisted `settings` object (in `localStorage`). It is sent only in the `Authorization` header of requests to `openrouter.ai` — never to any other server, and never stored outside the user's own browser.

---

## Vite Configuration

```ts
// vite.config.ts (key settings)
server: {
  host: '0.0.0.0',     // Required: listen on all interfaces for Replit proxy
  port: 5000,
  hmr: {
    protocol: 'wss',   // Secure WebSocket through Replit's HTTPS proxy
    clientPort: 443,
  },
  allowedHosts: 'all', // Required: Replit preview uses a different origin
}
```

HMR works through the Replit proxy. If styles stop updating, restart the workflow.

---

## Development Workflow

### Branch Strategy

- `main` — protected, production-ready only.
- All new work happens on feature branches (`feature/description`) or Replit agent branches.
- Changes are merged to `main` via Pull Request after review.
- Replit agent branches are automatically created when a task agent does work, and merged back to main when complete.

### Adding a Feature

1. Create the component in `src/components/`.
2. Add any new TypeScript interfaces to `src/types/index.ts`.
3. If the feature needs persistent state, add it to `chatStore.ts` and include it in `partialize`.
4. Add styles to `App.css` (use CSS variables for colors, do not hardcode hex values).
5. Wire the component into its parent (`App.tsx` or `ChatArea.tsx`).

### Updating the Store

1. Edit `src/store/chatStore.ts`.
2. Update matching interfaces in `src/types/index.ts`.
3. After changes, reload the app and verify data persists across a hard refresh (check `d-bolt-ai-storage` in DevTools).

---

## Deployment

### Pre-Deployment Checklist

- [ ] `npm run build` completes with no TypeScript errors
- [ ] Streaming works end-to-end with a real API key
- [ ] Copy, edit, regenerate, and export all function correctly
- [ ] Settings persist after a page reload
- [ ] No console errors in production build preview

### Publishing on Replit

1. Open the **Deploy** tab in the Replit workspace.
2. Replit will run `npm run build` and serve the `dist/` directory.
3. A `.replit.app` domain with automatic TLS is assigned.
4. The production environment is separate from the dev server — re-deploy after each significant change.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "No API key configured" | Open Settings, paste your OpenRouter key, click Save |
| Chat history gone | Check `d-bolt-ai-storage` in DevTools localStorage; browser data may have been cleared |
| Styles not updating | Restart the dev workflow; hard-refresh with Ctrl+Shift+R |
| Streaming not working | Check the Network tab for the OpenRouter request; verify the API key has credits |
| Preview pane blank | Ensure the workflow is running on port 5000; check workflow logs for startup errors |

---

## UI References

UI images are stored in `docs/images/` and embedded in `README.md`:

| File | Description |
|------|-------------|
| `docs/images/landing-page.png` | Hero section with animated lightning bolt and navigation |
| `docs/images/chat-ui.png` | Full chat interface with sidebar, welcome panel, and suggested prompts |

To retake screenshots after UI changes, use a headless Chromium via nix-shell:
```bash
nix-shell -p chromium --run \
  "chromium --headless=new --no-sandbox --disable-gpu --window-size=1280,800 \
   --screenshot=docs/images/landing-page.png http://localhost:5000"
```

## Maintenance Notes

Update this file whenever:
- The Zustand store shape or persist config changes.
- New routes or major layout changes are introduced.
- The Vite config or port changes.
- A new persistent field is added to `settings`.
- The deployment or build process changes.
