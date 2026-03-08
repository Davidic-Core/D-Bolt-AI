# D-Bolt-AI

D-Bolt-AI is a high-performance, intelligent coding assistant powered by the OpenRouter API. It provides a sleek, modern interface for developers to interact with world-class AI models like GPT-4o, GPT-4o Mini, Claude 3.5 Sonnet, and Claude 3 Haiku.

## 🚀 Features

- **Multi-Model Support**: Switch between GPT-4o, GPT-4o Mini, Claude 3.5 Sonnet, and Claude 3 Haiku instantly.  
- **Real-Time Streaming**: Experience ultra-fast, word-by-word response streaming.  
- **Smart Context**: Built-in system prompts optimized for expert-level coding assistance.  
- **Code Intelligence**: Beautiful syntax highlighting and one-click code copying.  
- **Persistent Sessions**: Your API keys and chat history stay with you across browser refreshes.  
- **Responsive Design**: Optimized for both focused coding and quick mobile lookups.  

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript  
- **Build Tool**: Vite  
- **State Management**: Zustand (with localStorage persistence)  
- **Styling**: Custom CSS with CSS Variables for easy theming  
- **AI Integration**: OpenRouter API  
- **Utilities**: Axios, React Markdown, Framer Motion  

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components (Sidebar, ChatArea, Settings, etc.)
├── store/            # Zustand state management (chatStore.ts)
├── types/            # TypeScript interfaces and types
├── utils/            # API integration and helper functions (ai.ts)
├── App.tsx           # Main application layout
└── main.tsx          # Application entry point


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

4. **Add your API Key**:
   - Open the application in your browser.
   - Click the **Settings** icon in the sidebar.
   - Enter your [OpenRouter API Key](https://openrouter.ai/keys).
   - Click **Save Settings**.

## 💡 Example Usage

Try asking D-Bolt-AI:
> "Write a TypeScript function that implements a debounce utility and explain how it works with a React useEffect hook."

## 🤝 Contribution Guidelines

- **Branch Strategy**: Use feature branches (`feature/your-feature`) for all changes.
- **Main Protection**: The `main` branch is protected. All changes must be submitted via Pull Request.
- **Code Quality**: Ensure all TypeScript types are correctly defined and avoid using `any`.

## ⚠️ Known Issues & Notes

- **API Key**: If you see "Missing Authentication Header", ensure your key is saved in the Settings panel.
- **Model Availability**: Some Meta-Llama free models may experience high latency during peak times.
  