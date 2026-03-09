# D-Bolt-AI

D-Bolt-AI is a high-performance, intelligent coding assistant powered by the OpenRouter API. It provides a sleek, modern interface for developers to interact with world-class AI models like GPT-4o, GPT-4o Mini, Claude 3.5 Sonnet, and Claude 3 Haiku.

## 🚀 Features

### Chat Capabilities
- **Real-Time Streaming**: Experience ultra-fast, word-by-word response streaming with live updates.
- **Copy Messages**: One-click copy to clipboard for any message (user or assistant).
- **Edit User Messages**: Modify previous user messages inline and resend them to the AI.
- **Regenerate Responses**: Re-run AI responses for any assistant message with full streaming.
- **Stop Generation**: Interrupt AI streaming at any time to view partial responses.
- **Export Chat**: Download conversations as JSON (structured data) or TXT (formatted markdown).
- **Smart Context**: Built-in system prompts optimized for expert-level coding assistance.
- **Code Intelligence**: Beautiful syntax highlighting and one-click code block copying.
- **Persistent Sessions**: All chat history, settings, and API keys automatically persist across browser refreshes.
- **Multi-Session Support**: Create and manage multiple chat conversations simultaneously.
- **Responsive Design**: Optimized for both focused coding and quick mobile lookups.

### AI Models
- **Multi-Model Support**: Instantly switch between different AI models to find the best fit for your task.

## 🤖 Supported AI Models

D-Bolt-AI currently supports the following AI models through OpenRouter:

### OpenAI
- **GPT-4o** - Most capable OpenAI model with advanced reasoning and code analysis
- **GPT-4o Mini** - Fast and affordable model for quick queries and iterations

### Anthropic
- **Claude 3.5 Sonnet** - Excellent for detailed coding assistance, explanations, and refactoring
- **Claude 3 Haiku** - Fast and efficient for quick responses and simple tasks

> **Note**: More models will be added as compatibility with OpenRouter is verified.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with persist middleware for automatic localStorage persistence
- **Styling**: Custom CSS with CSS Variables for easy theming
- **AI Integration**: OpenRouter API with streaming support
- **Markdown Rendering**: React Markdown with syntax highlighting via Prism
- **UI Components**: Feather Icons (react-icons), Framer Motion for animations

## 📂 Project Structure

```text
src/
├── components/
│   ├── ChatArea.tsx      # Main chat interface, streaming, regeneration, export
│   ├── ChatMessage.tsx   # Message rendering with edit, copy, regenerate buttons
│   ├── ChatInput.tsx     # Text input with auto-height and submission handling
│   ├── Sidebar.tsx       # Chat history and session management
│   └── Settings.tsx      # API key, model, temperature, and prompt configuration
├── store/
│   └── chatStore.ts      # Zustand store with persist middleware
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── ai.ts             # OpenRouter API integration and streaming
├── App.tsx               # Root layout component
└── main.tsx              # React entry point
```

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Davidic-Core/D-Bolt-AI.git
   cd D-Bolt-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

4. **Configure OpenRouter API Key**:
   - Open the application in your browser
   - Click the **Settings** icon in the sidebar
   - Paste your [OpenRouter API Key](https://openrouter.ai/keys)
   - Click **Save Settings**
   - Your key is stored locally in your browser and never sent to any server except OpenRouter

5. **Start chatting**:
   - Click **New Chat** to create a conversation
   - Type your message and press Enter to send
   - Use the action buttons on messages to copy, edit, regenerate, or export

## 💡 Example Usage

Try asking D-Bolt-AI:
> "Write a TypeScript function that implements a debounce utility and explain how it works with a React useEffect hook."

Or for refactoring:
> "Refactor this code to use async/await instead of promises and add proper error handling."

## 🔄 How It Works

### Message Flow
1. User types a message and presses Enter
2. Message is added to the current session in the store
3. All previous messages are sent to OpenRouter API
4. AI response streams in real-time, updating with each token
5. User can copy, edit, regenerate, or export the conversation

### State Persistence
The application uses Zustand's persist middleware to automatically store:
- **Chat sessions** - All conversations with their messages and metadata
- **Active session ID** - Which conversation is currently displayed
- **User settings** - API key, selected model, temperature, max tokens, and system prompt

This data is stored in localStorage under the key `d-bolt-ai-storage`, allowing chat history and settings to survive page reloads and browser restarts.

## 🤝 Contribution Guidelines

- **Branch Strategy**: Use feature branches (`feature/your-feature`) for all changes
- **Main Protection**: The `main` branch is protected; submit all changes via Pull Request
- **Code Quality**: Ensure all TypeScript types are correctly defined and avoid using `any`
- **Component Structure**: Keep components focused and reusable
- **Styling**: Use CSS variables for consistency and maintain dark theme throughout

## ⚠️ Known Issues & Notes

- **API Key**: Ensure your OpenRouter API key is valid and has sufficient credits. If you see "Missing Authentication Header", verify your key is saved correctly in Settings
- **Model Availability**: Some models may have different pricing or rate limits; check your OpenRouter account for current status
- **Session Persistence**: Chat history is stored locally in your browser. Clearing browser data will reset conversations
- **Streaming**: Ensure JavaScript is enabled and your connection is stable for smooth streaming responses

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.
