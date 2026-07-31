<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { NEmpty, NSpin } from 'naive-ui'
import { chapterData } from '@/data/chapter-data'
import type { ChapterContent } from '@/data/chapter-data'
import KnowledgeCard from './KnowledgeCard.vue'

const store = useAppStore()
const route = useRoute()
const loading = ref(false)

const chapterId = computed(() => {
  const id = route.params.chapterId
  return id ? parseInt(id as string) : 1
})

const content = computed<ChapterContent | null>(() => {
  return chapterData[chapterId.value] || null
})

onMounted(() => {
  store.setCurrentChapter(chapterId.value)
})
</script>

<template>
  <div class="theory-view">
    <div v-if="loading" class="loading-state">
      <NSpin size="large" />
    </div>

    <template v-else-if="content">
      <!-- 章节标题 -->
      <div class="chapter-header">
        <div class="chapter-number">第{{ content.chapter }}章</div>
        <h1 class="chapter-title">{{ content.title }}</h1>
        <p class="chapter-desc" v-if="content.description">{{ content.description }}</p>
      </div>

      <!-- 提纲 -->
      <div class="outline-section" v-if="content.outline?.length">
        <h2 class="section-label">提纲</h2>
        <div class="outline-list">
          <div
            v-for="(item, idx) in content.outline"
            :key="idx"
            class="outline-item"
          >
            <span class="outline-num">{{ idx + 1 }}.</span>
            <span class="outline-text">{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- 知识点卡片瀑布流 -->
      <div class="card-waterfall">
        <KnowledgeCard
          v-for="(card, idx) in content.cards"
          :key="idx"
          :card="card"
        />
      </div>

      <!-- 章末习题 -->
      <div class="exercises-section" v-if="content.exercises?.length">
        <h2 class="section-label">习题</h2>
        <div class="exercise-list">
          <div v-for="(ex, idx) in content.exercises" :key="idx" class="exercise-item">
            {{ ex }}
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <NEmpty description="该章节内容正在整理中..." />
    </div>
  </div>
</template>

<style scoped>
.theory-view {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-xl);
  min-height: 100vh;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.chapter-header {
  margin-bottom: var(--space-2xl);
}

.chapter-number {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-sm);
}

.chapter-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.chapter-desc {
  margin-top: var(--space-md);
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.outline-section {
  margin-bottom: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
}

.outline-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.outline-item {
  display: flex;
  gap: var(--space-sm);
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.outline-num {
  color: var(--color-accent);
  font-weight: 500;
  min-width: 24px;
}

.card-waterfall {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.exercises-section {
  margin-top: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.exercise-item {
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  padding: var(--space-xs) 0;
}
</style>
