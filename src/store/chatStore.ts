import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message, ChatSession, AppSettings } from '../types'

interface ChatStore {
  sessions: ChatSession[]
  activeSessionId: string | null
  settings: AppSettings
  isSettingsOpen: boolean
  isSidebarOpen: boolean

  createSession: () => string
  deleteSession: (id: string) => void
  setActiveSession: (id: string) => void
  addMessage: (sessionId: string, message: Message) => void
  updateMessage: (sessionId: string, messageId: string, content: string, isStreaming?: boolean) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  setSettingsOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void

  getActiveSession: () => ChatSession | null
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  selectedModel: 'openai/gpt-4o-mini',
  systemPrompt: 'You are D-Bolt-AI, an expert AI coding assistant. You help developers write, debug, and understand code. Provide clear, well-commented code examples when helpful. Format code in appropriate code blocks with language identifiers.',
  temperature: 0.7,
  maxTokens: 4096,
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      settings: DEFAULT_SETTINGS,
      isSettingsOpen: false,
      isSidebarOpen: true,

      createSession: () => {
        const id = generateId()
        const session: ChatSession = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: get().settings.selectedModel,
        }
        set(state => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }))
        return id
      },

      deleteSession: (id) => {
        set(state => {
          const sessions = state.sessions.filter(s => s.id !== id)
          const activeSessionId = state.activeSessionId === id
            ? sessions[0]?.id ?? null
            : state.activeSessionId
          return { sessions, activeSessionId }
        })
      },

      setActiveSession: (id) => {
        set({ activeSessionId: id })
      },

      addMessage: (sessionId, message) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, message], updatedAt: new Date() }
              : s
          ),
        }))
      },

      updateMessage: (sessionId, messageId, content, isStreaming) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === messageId ? { ...m, content, isStreaming } : m
                  ),
                  updatedAt: new Date(),
                }
              : s
          ),
        }))
      },

      updateSessionTitle: (sessionId, title) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId ? { ...s, title } : s
          ),
        }))
      },

      updateSettings: (settings) => {
        set(state => ({ settings: { ...state.settings, ...settings } }))
      },

      setSettingsOpen: (open) => {
        set({ isSettingsOpen: open })
      },

      setSidebarOpen: (open) => {
        set({ isSidebarOpen: open })
      },

      getActiveSession: () => {
        const state = get()
        return state.sessions.find(s => s.id === state.activeSessionId) ?? null
      },
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
)
