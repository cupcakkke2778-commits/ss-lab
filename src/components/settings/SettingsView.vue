<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NInput, NButton, NIcon, NTag, NCard, NEmpty, NCheckbox } from 'naive-ui'
import { Settings, Key, Trash2, Save, ShieldCheck } from 'lucide-vue-next'
import { setApiKey, getApiKey, clearApiKey as clearSecureKey, isRemembered } from '@/services/key-storage'

const apiKey = ref('')
const remember = ref(false)
const saved = ref(false)
const loading = ref(true)

onMounted(async () => {
  // 尝试加载已保存的 key
  const savedKey = await getApiKey()
  if (savedKey) {
    apiKey.value = savedKey
    remember.value = isRemembered()
  }
  loading.value = false
})

async function saveApiKey() {
  if (apiKey.value.trim()) {
    await setApiKey(apiKey.value.trim(), remember.value)
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  }
}

async function clearApiKey() {
  apiKey.value = ''
  remember.value = false
  clearSecureKey()
}
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <div class="header-icon">
        <NIcon size="28" color="var(--color-accent)"><Settings /></NIcon>
      </div>
      <div class="header-text">
        <h1 class="page-title">设置</h1>
        <p class="page-desc">配置应用参数与偏好</p>
      </div>
    </div>

    <div class="settings-sections">
      <!-- API 配置 -->
      <div class="settings-card">
        <div class="card-header">
          <div class="card-header-left">
            <NIcon size="20" color="var(--color-accent)"><Key /></NIcon>
            <h2 class="card-title">API 密钥</h2>
          </div>
          <NTag size="small" type="info" v-if="apiKey">已配置</NTag>
        </div>
        <p class="card-desc">配置 DeepSeek API 密钥以启用 AI 对话功能</p>
        <div class="input-row">
          <NInput
            v-model:value="apiKey"
            type="password"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            :clearable="true"
            class="api-input"
            show-password-on="click"
            :disabled="loading"
          />
          <div class="input-actions">
            <NButton type="primary" @click="saveApiKey" :disabled="!apiKey.trim() || loading">
              <template #icon>
                <NIcon><Save /></NIcon>
              </template>
              保存
            </NButton>
            <NButton quaternary @click="clearApiKey" :disabled="!apiKey || loading">
              <template #icon>
                <NIcon><Trash2 /></NIcon>
              </template>
              清除
            </NButton>
          </div>
        </div>

        <!-- 记住我选项 -->
        <div class="remember-row">
          <NCheckbox v-model:checked="remember" :disabled="!apiKey.trim()">
            <span class="remember-text">记住此密钥（加密存储到本地）</span>
          </NCheckbox>
        </div>

        <!-- 安全提示 -->
        <div class="security-notice">
          <NIcon size="14" color="var(--color-text-tertiary)"><ShieldCheck /></NIcon>
          <span>未勾选"记住"时，密钥仅在当前会话中有效，关闭页面后自动清除。勾选后密钥会使用 AES-256-GCM 加密后存储在本地。</span>
        </div>

        <div v-if="saved" class="save-hint">已保存</div>
      </div>

      <!-- 关于 -->
      <div class="settings-card">
        <h2 class="card-title">关于</h2>
        <div class="about-info">
          <div class="info-row">
            <span class="info-label">应用名称</span>
            <span class="info-value">S&S Lab</span>
          </div>
          <div class="info-row">
            <span class="info-label">版本</span>
            <span class="info-value">1.0.0</span>
          </div>
          <div class="info-row">
            <span class="info-label">技术栈</span>
            <span class="info-value">Vue 3 + Naive UI + Electron</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-xl);
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--color-accent-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
}

.page-desc {
  margin-top: var(--space-xs);
  font-size: 15px;
  color: var(--color-text-secondary);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.settings-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.api-input {
  width: 100%;
}

.input-actions {
  display: flex;
  gap: var(--space-sm);
}

.save-hint {
  margin-top: var(--space-sm);
  font-size: 13px;
  color: var(--color-success);
}

.remember-row {
  margin-top: var(--space-md);
}

.remember-text {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.security-notice {
  margin-top: var(--space-sm);
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

.about-info {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.info-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}
</style>
