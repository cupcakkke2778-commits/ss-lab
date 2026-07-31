/**
 * DeepSeek API 服务层
 * 负责与 DeepSeek API 的通信，支持流式输出
 */

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionChunk {
  content: string
  done: boolean
}

/**
 * 获取保存的 API Key
 * 使用安全存储模块
 */
import { getApiKeySync, hasApiKeySync } from './key-storage'

/**
 * 获取保存的 API Key
 */
export function getApiKey(): string {
  return getApiKeySync()
}

/**
 * 检查是否已配置 API Key
 */
export function hasApiKey(): boolean {
  return hasApiKeySync()
}

/**
 * 流式调用 DeepSeek Chat API
 * 使用 fetch + ReadableStream 实现 SSE 流式输出
 *
 * @param messages 消息列表（包含 system prompt 和对话历史）
 * @param onChunk 每个数据块的回调
 * @param onError 错误回调
 * @param onDone 完成回调
 * @param signal 可选的 AbortSignal，用于取消请求
 */
export async function streamChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const apiKey = getApiKey()
  if (!apiKey) {
    onError('请先在设置页面配置 DeepSeek API 密钥')
    return
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream: true,
        max_tokens: 4096,
        temperature: 0.7
      }),
      signal
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      let errorMsg = `API 请求失败 (${response.status})`
      if (response.status === 401) {
        errorMsg = 'API 密钥无效，请在设置中重新配置'
      } else if (response.status === 429) {
        errorMsg = '请求过于频繁，请稍后重试'
      } else if (response.status === 500) {
        errorMsg = 'DeepSeek 服务器错误，请稍后重试'
      } else if (errorBody) {
        try {
          const err = JSON.parse(errorBody)
          errorMsg = err.error?.message || errorMsg
        } catch { /* ignore */ }
      }
      onError(errorMsg)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('无法读取响应流')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)
        if (data === '[DONE]') {
          onDone()
          return
        }

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content) {
            onChunk(content)
          }
        } catch {
          // 跳过无法解析的 chunk
        }
      }
    }

    onDone()
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      onDone()
      return
    }
    const message = err instanceof Error ? err.message : '未知错误'
    onError(`网络错误: ${message}`)
  }
}

/**
 * 非流式调用 DeepSeek Chat API（简单场景使用）
 */
export async function chat(
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('请先在设置页面配置 DeepSeek API 密钥')
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      stream: false,
      max_tokens: 4096,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    let errorMsg = `API 请求失败 (${response.status})`
    if (errorBody) {
      try {
        const err = JSON.parse(errorBody)
        errorMsg = err.error?.message || errorMsg
      } catch { /* ignore */ }
    }
    throw new Error(errorMsg)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
