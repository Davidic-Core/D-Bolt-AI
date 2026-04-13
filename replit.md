# D⚡BOLT — Replit Developer Guide

Internal reference for developing, debugging, and deploying D⚡BOLT on Replit. Covers architecture, data flows, state management, deployment, and troubleshooting.

---

## Quick Start

```bash
npm install       # Install all dependencies
npm run dev       # Start Vite dev server on port 5000
npm run build     # TypeScript compile + Vite production bundle → dist/
npm run preview   # Serve the production build locally
```

The app is proxied through Replit's preview pane. Always use the Replit preview URL — not `localhost` — to view the running app.

---

## Architecture Overview

### Stack

| Layer            | Technology                              | Notes                                      |
|------------------|-----------------------------------------|--------------------------------------------|
| UI Framework     | React 18 + TypeScript                   | Strict mode, `react-jsx` transform         |
| Build Tool       | Vite 5 (port 5000, host 0.0.0.0)       | ESM, fast HMR, Rollup production bundle    |
| State Management | Zustand 4 with `persist` middleware     | localStorage key: `d-bolt-ai-storage`      |
| AI Integration   | OpenRouter API                          | SSE streaming, fetch-based, client-side    |
| Routing          | React Router DOM 7                      | Hash-free client-side routing              |
| Styling          | Custom CSS + CSS Custom Properties      | Dark theme via `:root` variables           |

### Application Routes

| Path    | Component    | Description                               |
|---------|--------------|-------------------------------------------|
| `/`     | `HomePage`   | Home page + ImageAnalysisSection          |
| `/chat` | `ChatPage`   | Full chat interface with sidebar          |

### Component Tree

```
App.tsx  (BrowserRouter + ErrorBoundary)
├── Navbar.tsx                    — Top nav: Home/Chat links, Settings icon
├── Route "/"
│   └── AppLayout > HomePage.tsx
│       ├── Hero section
│       ├── Features section
│       ├── Models section
│       ├── ImageAnalysisSection  — Upload, preview, analyze, stream, copy
│       └── CTA section
└── Route "/chat"
    └── ChatPage (inline in App.tsx)
        ├── Sidebar.tsx           — Session list, new-chat button
        ├── ChatArea.tsx          — Streaming, abort, export, regenerate
        │   ├── SuggestedPrompts.tsx
        │   ├── ChatMessage.tsx   — Copy, edit, regenerate per message
        │   ├── TypingIndicator.tsx
        │   └── ChatInput.tsx
        └── Settings.tsx (modal)  — API key, model, params, system prompt
```

### Key Files

| File                      | Responsibility                                                      |
|---------------------------|---------------------------------------------------------------------|
| `src/App.tsx`             | Root layout, routing, lazy-loaded HomePage                          |
| `src/pages/HomePage.tsx`  | Home page + self-contained `ImageAnalysisSection` component         |
| `src/pages/HomePage.css`  | All home page styles: hero, drop zone, result card, copy button     |
| `src/components/ChatArea.tsx` | Core chat orchestration: send, stream, abort, regenerate, export |
| `src/store/chatStore.ts`  | Zustand store — all persisted and ephemeral app state               |
| `src/utils/ai.ts`         | `streamCompletion()` (chat) + `analyzeImageStream()` (vision)       |
| `src/types/index.ts`      | `Message`, `ChatSession`, `AppSettings` TypeScript interfaces       |
| `vite.config.ts`          | Vite server config for Replit proxy compatibility                   |

---

## Chat Streaming Flow

```
User types → Enter key
    │
    ▼
ChatArea.handleSend()
    ├── Adds user Message to Zustand store
    ├── Creates placeholder assistant Message (isStreaming: true)
    ├── Creates AbortController → stored in abortRef
    │
    ▼
streamCompletion(messages, settings, signal)   [src/utils/ai.ts]
    ├── POST https://openrouter.ai/api/v1/chat/completions
    │   ├── Authorization: Bearer <apiKey>
    │   ├── model: settings.selectedModel
    │   ├── stream: true
    │   └── messages: [system prompt, ...session history, user message]
    │
    ├── ReadableStream → TextDecoder → split on '\n'
    ├── Parse SSE lines: 'data: {...}' → choices[0].delta.content
    └── yield chunk  →  ChatArea accumulates → updateMessage() → UI re-renders
         │
         ▼
    Stream ends / AbortError caught
         ├── updateMessage(id, fullContent, isStreaming: false)
         └── setIsStreaming(false)
```

**Abort:** `abortRef.current.abort()` signals the fetch — caught as `AbortError`, partial content is preserved.

**Regenerate:** Slices the message history up to the triggering user message, creates a new assistant placeholder, and re-runs `streamCompletion`.

---

## Image Analysis Pipeline

```
User drops / selects a file
    │
    ▼
ImageAnalysisSection.loadFile()
    ├── Validates: image/*, ≤ 10 MB
    ├── FileReader.readAsDataURL()  →  base64 data URL stored in state
    └── Sets previewUrl for inline image display

User clicks "Analyze Image"
    │
    ▼
analyzeImageStream(imageDataUrl, apiKey, signal)   [src/utils/ai.ts]
    ├── POST https://openrouter.ai/api/v1/chat/completions
    │   ├── model: "openai/gpt-4o"  (always — vision-capable)
    │   └── messages[0].content: [
    │           { type: "image_url", image_url: { url: dataUrl, detail: "auto" } },
    │           { type: "text",      text: "Analyze this image..." }
    │       ]
    │
    ├── Same SSE stream pattern as chat
    └── yield chunk  →  setResult(prev + chunk)  →  ReactMarkdown renders

User clicks "Copy"
    └── navigator.clipboard.writeText(result)
        └── setIsCopied(true) → "Copied!" label → reset after 2 s

User clicks "Stop Analysis"
    └── abortRef.current.abort()  →  AbortError caught  →  partial result preserved
```

**State scope:** All image analysis state (`previewUrl`, `imageDataUrl`, `result`, `isAnalyzing`, `error`, `isCopied`) lives in local React `useState` inside `ImageAnalysisSection`. Nothing is persisted or written to Zustand.

---

## State Management

### Zustand Store — `src/store/chatStore.ts`

```
useChatStore
├── Persisted to localStorage (via partialize)
│   ├── sessions: ChatSession[]          — all conversations + message history
│   ├── activeSessionId: string | null   — currently displayed session
│   └── settings: AppSettings           — apiKey, model, temperature, maxTokens, systemPrompt
│
└── In-memory only (resets on page load)
    ├── isSettingsOpen: boolean
    └── isSidebarOpen: boolean
```

**localStorage key:** `d-bolt-ai-storage`

**`partialize`** ensures only the three persisted fields are written to `localStorage` — ephemeral UI state is never serialized.

### TypeScript Interfaces — `src/types/index.ts`

```typescript
Message       { id, role, content, timestamp, isStreaming? }
ChatSession   { id, title, messages, createdAt, updatedAt, model }
AppSettings   { apiKey, selectedModel, systemPrompt, temperature, maxTokens }
```

---

## Vite Configuration

```ts
// vite.config.ts
server: {
  host: true,                        // 0.0.0.0 — required for Replit proxy
  port: 5000,
  strictPort: true,                  // Fail fast if port is taken
  allowedHosts: ['.replit.dev', '.replit.app', 'localhost'],
  hmr: {
    protocol: 'wss',                 // Secure WS through Replit HTTPS proxy
    clientPort: 443,
  },
}
```

**HMR note:** WebSocket HMR connections through Replit's proxy will log `ERR_CONNECTION_REFUSED` in the browser console — this is expected and does not affect functionality. The app polls for server reconnection automatically.

---

## Deployment

### Pre-Deployment Checklist

- [ ] `npm run build` completes with zero TypeScript errors
- [ ] Chat streaming works end-to-end with a real OpenRouter API key
- [ ] Copy, edit, regenerate, and export all function correctly
- [ ] Settings persist after a full page reload (check `d-bolt-ai-storage` in DevTools)
- [ ] Image upload, analysis, copy, and stop all work on the home page
- [ ] No errors in the browser console on the production build preview

### Publishing on Replit

1. Open the **Deploy** tab in the Replit workspace.
2. Replit runs `npm run build` and serves the `dist/` directory.
3. A `.replit.app` subdomain with automatic HTTPS/TLS is assigned.
4. The production environment is isolated from the dev server — re-deploy after each significant change.

### Manual Build Verification

```bash
npm run build          # Verify clean compile
npx serve dist -p 4000 # Test the static bundle locally on port 4000
```

---

## Development Conventions

### Adding a New Feature

1. Create the component in `src/components/` with a co-located `.css` file if needed.
2. Add TypeScript interfaces to `src/types/index.ts`.
3. If persistent state is required, add it to `chatStore.ts` and include it in `partialize`.
4. Use CSS variables for all colors — never hardcode hex values in component CSS.
5. Wire into the parent component (`App.tsx`, `ChatArea.tsx`, or `HomePage.tsx`).

### CSS Variable Reference (from `src/index.css`)

```css
--bg-primary      /* Main page background  */
--bg-secondary    /* Cards, sidebar, panels */
--border          /* Subtle borders         */
--text-primary    /* Main readable text     */
--text-secondary  /* Muted / supporting text */
--accent          /* Violet #7c3aed         */
```

Cyan highlights (`#22d3ee`, `rgba(6,182,212,...)`) are used directly where a glow or interactive accent is needed.

### Updating the Zustand Store

1. Edit the interface in `src/store/chatStore.ts`.
2. Update matching types in `src/types/index.ts`.
3. If adding a persisted field, add it to `partialize`.
4. Hard-refresh after changes and verify the value appears correctly in DevTools → Application → Local Storage → `d-bolt-ai-storage`.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "No API key configured" | Key not set in Settings | Open Settings → paste OpenRouter key → Save |
| Chat history disappeared | localStorage cleared | Check `d-bolt-ai-storage` in DevTools; cannot be recovered once cleared |
| Styles not updating in preview | HMR cache stale | Restart the workflow; hard-refresh with Ctrl+Shift+R |
| Streaming stops mid-response | Network interruption or abort signal | Check Network tab; verify API key has credits |
| Preview pane blank / white screen | Dev server not running | Restart the `Start application` workflow; check logs for port conflicts |
| Port 5000 already in use | Previous process still running | Restart the workflow — Replit will reclaim the port |
| Image analysis returns API error | GPT-4o access required | Verify your OpenRouter key has access to `openai/gpt-4o` |
| "Image must be under 10 MB" | File too large | Compress or resize the image before uploading |
| Image analysis result not streaming | SSE issue | Open DevTools Network tab and inspect the `/chat/completions` request response |
| Copy button has no effect | Clipboard API blocked | Ensure the site is served over HTTPS (Replit proxy provides this) |

---

## Asset References

| Asset | Path | Description |
|-------|------|-------------|
| Home page screenshot | `docs/images/homepage-preview.jpg` | Hero section + navigation |
| Chat UI screenshot | `docs/images/chat-ui-preview.jpg` | Full chat interface with sidebar |
| Image Analysis preview | `docs/images/image-analysis-preview.png` | Image Analysis section on home page |
| Public config | `public/robots.txt` | Crawler directives served at root |

---

## Maintenance Notes

Update this file whenever:
- The Zustand store shape or `partialize` config changes
- New routes or significant layout changes are introduced
- The Vite config, port, or `allowedHosts` changes
- A new AI function is added to `src/utils/ai.ts`
- The deployment or build process changes
