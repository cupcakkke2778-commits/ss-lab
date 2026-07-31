<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NCard, NGrid, NGi } from 'naive-ui'
import { FlaskConical, Play } from 'lucide-vue-next'

const store = useAppStore()
const router = useRouter()

function openAnimation(id: number) {
  router.push(`/lab/${id}`)
}
</script>

<template>
  <div class="lab-view">
    <div class="page-header">
      <div class="header-icon">
        <NIcon size="28" color="var(--color-accent)"><FlaskConical /></NIcon>
      </div>
      <div class="header-text">
        <h1 class="page-title">仿真实验室</h1>
        <p class="page-desc">通过交互式动画直观理解信号与系统的核心概念</p>
      </div>
    </div>

    <div class="animation-grid">
      <div
        v-for="anim in store.labAnimations"
        :key="anim.id"
        class="animation-card"
        @click="openAnimation(anim.id)"
      >
        <div class="card-content">
          <div class="card-icon">
            <NIcon size="24" color="var(--color-accent)"><FlaskConical /></NIcon>
          </div>
          <h3 class="card-title">{{ anim.title }}</h3>
          <p class="card-desc">{{ anim.description }}</p>
        </div>
        <div class="card-footer">
          <NButton size="tiny" quaternary round>
            <template #icon>
              <NIcon><Play /></NIcon>
            </template>
            开始实验
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-view {
  max-width: 1100px;
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

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.animation-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.animation-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-content {
  flex: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: var(--color-accent-bg);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.card-footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
}
</style>
