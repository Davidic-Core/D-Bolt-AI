import { Message, AppSettings } from '../types'

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type VisionContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail: 'auto' } }

export const AVAILABLE_MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', description: 'Fast and affordable' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Most capable OpenAI model' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Excellent coding assistant' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fast and efficient' },
]
export async function* streamCompletion(
  messages: Message[],
  settings: AppSettings,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const apiKey = settings.apiKey?.trim()

  if (!apiKey) {
    throw new Error('No API key configured. Please add your OpenRouter API key in Settings.')
  }

  const openRouterMessages: OpenRouterMessage[] = [
    { role: 'system', content: settings.systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'D-Bolt-AI',
    },
    body: JSON.stringify({
      model: settings.selectedModel,
      messages: openRouterMessages,
      stream: true,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }))
    throw new Error(error?.error?.message ?? `API error: ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {
          // skip malformed chunks
        }
      }
    }
  }
}

export function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim()
  if (trimmed.length <= 40) return trimmed
  return trimmed.substring(0, 37) + '...'
}

export async function* analyzeImageStream(
  imageDataUrl: string,
  apiKey: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  if (!apiKey?.trim()) {
    throw new Error('No API key configured. Please add your OpenRouter API key in Settings.')
  }

  const visionContent: VisionContentPart[] = [
    {
      type: 'image_url',
      image_url: { url: imageDataUrl, detail: 'auto' },
    },
    {
      type: 'text',
      text: 'Analyze this image thoroughly. Describe what you see, identify any code, text, diagrams, UI elements, or technical content. If it contains code, explain what it does and suggest improvements. If it shows a UI or design, describe the layout and components. Be detailed and technical where appropriate.',
    },
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'D-Bolt-AI',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: visionContent,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }))
    throw new Error(error?.error?.message ?? `API error: ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {
          // skip malformed chunks
        }
      }
    }
  }
}
