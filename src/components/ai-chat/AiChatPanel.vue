<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, nextTick, watch } from 'vue'
import { NButton, NIcon, NTag, NSelect, NScrollbar, NSpin } from 'naive-ui'
import { X, MessageSquareText, ChevronRight, Send, AlertCircle, RefreshCw, Trash2 } from 'lucide-vue-next'
import { getAllModes, getModePrompt, getGlobalRules } from '@/config/ai-prompts'
import { streamChat, hasApiKey, type ChatMessage } from '@/services/api'
import { hasApiKeySync } from '@/services/key-storage'

const store = useAppStore()
const modes = getAllModes()

const message = ref('')
const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([])
const loading = ref(false)
const error = ref('')
const scrollbarRef = ref<InstanceType<typeof NScrollbar> | null>(null)

// 当前是否已配置 API Key
const apiKeyConfigured = ref(hasApiKeySync())

// 定时检查 API Key 状态（当从设置页返回时）
let keyCheckInterval: ReturnType<typeof setInterval> | null = null

// 组件挂载时开始检查
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  apiKeyConfigured.value = hasApiKeySync()
  keyCheckInterval = setInterval(() => {
    apiKeyConfigured.value = hasApiKeySync()
  }, 2000)
})
onUnmounted(() => {
  if (keyCheckInterval) clearInterval(keyCheckInterval)
})

// 取消请求的控制器
let abortController: AbortController | null = null

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (scrollbarRef.value) {
    try {
      const el = scrollbarRef.value.$el as HTMLElement
      const container = el.querySelector('.n-scrollbar-content')?.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    } catch {
      // 忽略滚动错误
    }
  }
}

// 构建系统 Prompt
function buildSystemPrompt(): string {
  const globalRules = getGlobalRules()
  const modePrompt = getModePrompt(store.aiMode)
  return `${globalRules}\n\n${modePrompt}`
}

// 发送消息
async function sendMessage() {
  if (!message.value.trim() || loading.value) return

  const userText = message.value.trim()
  message.value = ''
  error.value = ''

  // 检查 API Key
  if (!apiKeyConfigured.value) {
    error.value = '请先在设置页面配置 DeepSeek API 密钥'
    return
  }

  // 添加用户消息
  messages.value.push({ role: 'user', content: userText })
  await scrollToBottom()

  // 添加占位的助手消息
  const assistantIdx = messages.value.length
  messages.value.push({ role: 'assistant', content: '' })
  loading.value = true

  // 构建消息列表
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...messages.value.slice(0, -1).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))
  ]

  // 创建取消控制器
  abortController = new AbortController()

  // 流式调用 API
  await streamChat(
    chatMessages,
    // onChunk
    (chunk: string) => {
      messages.value[assistantIdx] = {
        role: 'assistant',
        content: messages.value[assistantIdx].content + chunk
      }
      scrollToBottom()
    },
    // onError
    (err: string) => {
      error.value = err
      // 如果助手消息为空，移除它
      if (!messages.value[assistantIdx]?.content) {
        messages.value.splice(assistantIdx, 1)
      }
      loading.value = false
    },
    // onDone
    () => {
      loading.value = false
      abortController = null
      scrollToBottom()
    },
    abortController.signal
  )
}

// 取消请求
function cancelRequest() {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
}

// 清空对话
function clearMessages() {
  cancelRequest()
  messages.value = []
  error.value = ''
}

// 切换模式
function handleModeChange(value: string) {
  store.setAiMode(value)
  // 切换模式时不清空对话，但可以添加系统提示
  if (messages.value.length > 0) {
    messages.value.push({
      role: 'assistant',
      content: `已切换至「${value}」模式，请提出你的问题。`
    })
  }
}

// 重发最后一条消息（快捷重试）
function retryLastMessage() {
  if (messages.value.length < 2) return
  const lastUserMsg = [...messages.value].reverse().find(m => m.role === 'user')
  if (lastUserMsg) {
    message.value = lastUserMsg.content
    // 移除最后两条消息（用户+助手）
    messages.value.splice(-2)
    sendMessage()
  }
}
</script>

<template>
  <div
    v-show="store.aiChatVisible"
    :class="['ai-chat-panel', { collapsed: store.aiChatCollapsed }]"
  >
    <!-- 折叠状态：只显示标签 -->
    <div
      v-if="store.aiChatCollapsed"
      class="ai-chat-tab"
      @click="store.toggleAiChat"
    >
      <NIcon size="20"><MessageSquareText /></NIcon>
      <span>AI</span>
    </div>

    <!-- 展开状态：完整对话窗口 -->
    <div v-else class="ai-chat-window">
      <!-- 头部 -->
      <div class="ai-chat-header">
        <div class="header-left">
          <NIcon size="18" color="var(--color-accent)"><MessageSquareText /></NIcon>
          <span class="header-title">AI 学习助手</span>
        </div>
        <div class="header-actions">
          <NSelect
            :value="store.aiMode"
            :options="modes.map(m => ({ label: m, value: m }))"
            size="tiny"
            @update:value="handleModeChange"
            class="mode-select"
          />
          <NButton quaternary circle size="tiny" @click="store.toggleAiChat">
            <template #icon>
              <NIcon><ChevronRight /></NIcon>
            </template>
          </NButton>
        </div>
      </div>

      <!-- 当前模式标签 + 操作按钮 -->
      <div class="mode-badge">
        <NTag :bordered="false" size="small" :color="{ color: '#e3f0ff', textColor: '#0071e3' }">
          {{ store.aiMode }}
        </NTag>
        <div class="badge-actions">
          <NButton
            v-if="messages.length > 0"
            quaternary
            circle
            size="tiny"
            @click="clearMessages"
            title="清空对话"
          >
            <template #icon>
              <NIcon size="14"><Trash2 /></NIcon>
            </template>
          </NButton>
        </div>
      </div>

      <!-- 消息列表 -->
      <NScrollbar ref="scrollbarRef" class="chat-messages">
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="chat-empty">
          <NIcon size="40" color="var(--color-text-tertiary)"><MessageSquareText /></NIcon>
          <p>你好！我是你的信号与系统学习助手</p>
          <p class="empty-hint">当前模式：{{ store.aiMode }}</p>
          <p class="empty-hint" v-if="!apiKeyConfigured" style="color: var(--color-warning);">
            请先在设置页面配置 API 密钥
          </p>
          <p class="empty-hint" v-else>你可以问我任何信号与系统相关的问题</p>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['message', msg.role]"
        >
          <div class="message-content">{{ msg.content }}</div>
        </div>

        <!-- 加载指示器 -->
        <div v-if="loading" class="message assistant">
          <div class="message-content loading-indicator">
            <NSpin size="small" />
            <span>思考中...</span>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="message-error">
          <NIcon size="14" color="var(--color-error)"><AlertCircle /></NIcon>
          <span>{{ error }}</span>
          <NButton text size="tiny" type="primary" @click="retryLastMessage" v-if="messages.length >= 2">
            重试
          </NButton>
        </div>
      </NScrollbar>

      <!-- 输入区 -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <input
            v-model="message"
            type="text"
            placeholder="输入你的问题..."
            class="chat-input"
            :disabled="loading"
            @keydown.enter="sendMessage"
          />
          <NButton
            v-if="loading"
            quaternary
            circle
            size="small"
            @click="cancelRequest"
            class="send-btn"
            title="停止生成"
          >
            <template #icon>
              <NIcon size="16"><X /></NIcon>
            </template>
          </NButton>
          <NButton
            v-else
            quaternary
            circle
            size="small"
            @click="sendMessage"
            class="send-btn"
            :disabled="!message.trim() || !apiKeyConfigured"
          >
            <template #icon>
              <NIcon><Send /></NIcon>
            </template>
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.ai-chat-panel.collapsed {
  right: 0;
}

.ai-chat-tab {
  width: 40px;
  height: 120px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-right: none;
  border-radius: 10px 0 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.ai-chat-tab:hover {
  background: var(--color-accent-light);
}

.ai-chat-window {
  width: var(--ai-chat-width);
  height: 100vh;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
}

.ai-chat-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-select {
  width: 120px;
}

.mode-badge {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-messages {
  flex: 1;
  padding: 16px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.message {
  margin-bottom: 16px;
}

.message.user {
  text-align: right;
}

.message.user .message-content {
  display: inline-block;
  background: var(--color-accent);
  color: white;
  padding: 10px 16px;
  border-radius: 18px 18px 4px 18px;
  font-size: 14px;
  max-width: 85%;
  text-align: left;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.assistant .message-content {
  display: inline-block;
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  padding: 10px 16px;
  border-radius: 18px 18px 18px 4px;
  font-size: 14px;
  max-width: 85%;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.loading-indicator {
  display: flex !important;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary) !important;
  background: var(--color-bg-tertiary) !important;
}

.message-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 69, 58, 0.08);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-error);
  margin-bottom: 8px;
}

.chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-light);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg);
  border-radius: 20px;
  padding: 4px 4px 4px 16px;
  border: 1px solid var(--color-border-light);
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--color-accent);
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.chat-input::placeholder {
  color: var(--color-text-tertiary);
}

.send-btn {
  color: var(--color-accent);
}
</style>
