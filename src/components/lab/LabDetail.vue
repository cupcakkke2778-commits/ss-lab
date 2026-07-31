<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { NButton, NIcon, NEmpty } from 'naive-ui'
import { ArrowLeft, FlaskConical } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const animId = computed(() => parseInt(route.params.id as string))
const animation = computed(() =>
  store.labAnimations.find(a => a.id === animId.value)
)

function goBack() {
  router.push('/lab')
}
</script>

<template>
  <div class="lab-detail">
    <div class="detail-header">
      <NButton quaternary @click="goBack" class="back-btn">
        <template #icon>
          <NIcon><ArrowLeft /></NIcon>
        </template>
        返回实验室
      </NButton>
    </div>

    <div v-if="animation" class="detail-content">
      <div class="anim-header">
        <div class="anim-icon">
          <NIcon size="28" color="var(--color-accent)"><FlaskConical /></NIcon>
        </div>
        <div>
          <h1 class="anim-title">{{ animation.title }}</h1>
          <p class="anim-desc">{{ animation.description }}</p>
        </div>
      </div>

      <div class="anim-placeholder">
        <NEmpty description="交互动画正在开发中..." />
        <p class="placeholder-hint">该动画将在后续版本中实现</p>
      </div>
    </div>

    <div v-else class="not-found">
      <NEmpty description="未找到该动画" />
      <NButton quaternary @click="goBack" class="back-btn">返回实验室</NButton>
    </div>
  </div>
</template>

<style scoped>
.lab-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-xl);
  min-height: 100vh;
}

.detail-header {
  margin-bottom: var(--space-lg);
}

.back-btn {
  color: var(--color-accent);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.anim-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.anim-icon {
  width: 56px;
  height: 56px;
  background: var(--color-accent-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.anim-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.anim-desc {
  margin-top: var(--space-xs);
  font-size: 15px;
  color: var(--color-text-secondary);
}

.anim-placeholder {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  min-height: 400px;
  justify-content: center;
}

.placeholder-hint {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding-top: var(--space-3xl);
}
</style>
