# Replit Development Guide: D-Bolt-AI

This document provides specific instructions for developing and running D-Bolt-AI within the Replit environment, including architecture details and deployment information.

## 🚀 Quick Start on Replit

1. **Environment Setup**: Replit automatically detects the `package.json` configuration. If dependencies aren't installed, run:
   ```bash
   npm install
   ```

2. **Run Application**: Click the "Run" button or execute:
   ```bash
   npm run dev
   ```
   The app will be available on port `5000` via the Replit proxy.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   This generates optimized static files in the `dist/` directory.

## 🏗️ Architecture Overview

### Frontend Architecture
D-Bolt-AI uses a component-based React architecture:

- **React 18 + TypeScript**: Type-safe UI components
- **Vite**: Fast development server and optimized production builds
- **Zustand**: Lightweight state management with automatic persistence
- **CSS Variables**: Theme system for consistent styling

### State Management
The application uses Zustand with the persist middleware to manage all application state:

**Persisted State** (automatically saved to localStorage):
- `sessions[]` - Array of all chat conversations with messages
- `activeSessionId` - Currently displayed conversation
- `settings` - User configuration (API key, model, temperature, max tokens, system prompt)

**Non-Persisted State** (UI-only):
- `isSettingsOpen` - Settings modal visibility
- `isSidebarOpen` - Sidebar toggle state

The persist middleware stores all data under the localStorage key `d-bolt-ai-storage`, which ensures chat history and user preferences survive page reloads and browser restarts.

### API Integration
- **OpenRouter API**: Handles all AI requests via `src/utils/ai.ts`
- **Streaming Support**: Real-time token generation with proper error handling
- **Authentication**: API key stored securely in browser localStorage, only sent to OpenRouter

## 🔑 API Configuration

### OpenRouter API Key Setup

1. **Get Your Key**:
   - Visit [OpenRouter Keys](https://openrouter.ai/keys)
   - Create or copy your API key

2. **Configure in App**:
   - Open the application in Replit Preview
   - Click the Settings button (gear icon) in the sidebar
   - Paste your OpenRouter API key
   - Click Save Settings

3. **Storage & Security**:
   - The key is stored locally in your browser's localStorage (not on Replit servers)
   - The key is only transmitted directly to OpenRouter for API calls
   - Clearing your browser data will delete the saved key

### State Persistence Details

The application uses **Zustand's persist middleware** to automatically manage state:

```javascript
// From src/store/chatStore.ts
persist(
  (set, get) => ({
    // store implementation
  }),
  {
    name: 'd-bolt-ai-storage',
    partialize: (state) => ({
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      settings: state.settings,
    }),
  }
)
```

This configuration:
- Saves state to localStorage under `d-bolt-ai-storage`
- Automatically loads state on app initialization
- Only persists necessary fields (not UI state like modal visibility)
- Provides offline functionality with automatic sync on reconnect

## 🔄 Development Workflow

### Hot Module Replacement (HMR)
HMR is configured to work through the Replit proxy:
- **Configuration**: `vite.config.ts` sets `hmr.protocol: 'wss'` for secure WebSocket
- **Proxy Compatibility**: Uses `allowedHosts: 'all'` to work with Replit's iframe proxy
- **Troubleshooting**: If styles aren't updating, check `vite.config.ts` and restart the dev server

### Testing the AI Features
To test chat functionality:
1. Ensure you have an active OpenRouter API key
2. Configure it in Settings
3. Test with a simple prompt: "Say hello"
4. Verify streaming works (tokens appear in real-time)
5. Test features: copy, edit, regenerate, export

### Common Development Tasks

**Add a New Feature**:
1. Create component in `src/components/`
2. Add types to `src/types/index.ts` if needed
3. Update store in `src/store/chatStore.ts` if state is required
4. Add styling to `src/App.css`
5. Integrate into parent component

**Update Store Actions**:
1. Modify `src/store/chatStore.ts`
2. Update TypeScript interfaces
3. Test that persistence works (data survives page reload)

**Add API Integration**:
1. Create utility function in `src/utils/`
2. Use in component via store actions
3. Handle errors gracefully with user feedback

## 🌿 Git & Deployment Strategy

### Branch Strategy
- **Main Branch**: Production-ready code only
- **Feature Branches**: `feature/description` for all new work
- **Hotfix Branches**: `hotfix/description` for critical fixes
- **Never commit directly to main** - use Pull Requests

### Pre-Deployment Checklist
Before publishing:
1. Run `npm run build` locally to verify production build
2. Test all major features (chat, copy, edit, regenerate, export)
3. Verify settings persistence works
4. Check console for TypeScript or runtime errors
5. Ensure responsive design works on mobile

### Publishing to Production
1. Use the Replit **Deploy** tab
2. Deployment automatically:
   - Runs `npm run build`
   - Serves static files from `dist/` directory
   - Applies TLS/SSL certificates
   - Generates a .replit.app domain

### Environment Configuration
Replit automatically configures:
- Host: `0.0.0.0` (accessible on all network interfaces)
- Port: `5000` (for dev) or `3000` (for preview)
- HTTPS: Automatic (required for OpenRouter CORS)

## 📊 Performance Considerations

### Optimization Tips
- **Lazy Load Components**: Use React.lazy for heavy components if needed
- **Memoization**: Use React.memo for components that don't need frequent re-renders
- **State Management**: Keep store actions lean and avoid unnecessary re-renders
- **Bundle Size**: Monitor with `npm run build` output

### Current Performance
- Development: Instant reload with Vite HMR
- Production: Optimized static bundle (~1MB gzipped)
- AI Streaming: Real-time token streaming with smooth UI updates

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server on port 5000
npm run build           # Build for production
npm run preview         # Preview production build locally

# Maintenance
npm update              # Update all dependencies
npm audit              # Check for security vulnerabilities
npm install            # Reinstall all dependencies
```

## 📚 Project Dependencies

**Key Dependencies**:
- `react` - UI framework
- `zustand` - State management
- `react-markdown` - Markdown rendering
- `react-syntax-highlighter` - Code syntax highlighting
- `react-icons` - Icon library
- `axios` - HTTP client (optional, fetch used instead)
- `framer-motion` - Animation library

**Dev Dependencies**:
- `vite` - Build tool
- `typescript` - Type safety
- `@vitejs/plugin-react` - Vite React plugin

## 📝 Maintenance

Update this file whenever you:
- Make significant architectural changes
- Modify state management structure
- Change API integration approach
- Update deployment or build process
- Add new persistent state

## 🐛 Troubleshooting

### Common Issues

**"No API key configured" error**:
- Open Settings and verify your API key is saved
- Check OpenRouter account has active credits
- Ensure key format is correct (starts with `sk-or-...`)

**Chat history disappears**:
- Check browser localStorage isn't being cleared on exit
- Verify `d-bolt-ai-storage` exists in DevTools Storage tab
- Try clearing cache and reloading

**Styles not updating**:
- Restart dev server: press `Ctrl+C` then `npm run dev`
- Check `vite.config.ts` HMR configuration
- Hard refresh browser with `Ctrl+Shift+R`

**Streaming not working**:
- Verify network tab shows WebSocket connection to OpenRouter
- Check API key validity in OpenRouter account
- Try a simple test message first before complex requests

For more help, check the main README.md or create an issue on GitHub.
