<script setup lang="ts">
import type { KnowledgeCard as KnowledgeCardType } from '@/data/chapter-data'
import { useAppStore } from '@/stores/app'
import { onMounted, ref, nextTick } from 'vue'
import katex from 'katex'

const props = defineProps<{
  card: KnowledgeCardType
}>()

const store = useAppStore()
const contentRef = ref<HTMLElement>()

function renderLatex(text: string): string {
  if (!text) return ''

  // 替换块级公式 $$...$$
  let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false
      })
    } catch {
      return `<div class="katex-error">${formula}</div>`
    }
  })

  // 替换行内公式 $...$
  result = result.replace(/\$([^$\n]+?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false
      })
    } catch {
      return `$${formula}$`
    }
  })

  return result
}

function handleTextSelect() {
  const selection = window.getSelection()
  if (selection && selection.toString().trim()) {
    store.setSelectedText(selection.toString().trim())
  }
}

onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.querySelectorAll('.latex-content').forEach(el => {
        el.innerHTML = renderLatex(el.textContent || '')
      })
    }
  })
})
</script>

<template>
  <div class="knowledge-card" @mouseup="handleTextSelect">
    <!-- 卡片标题 -->
    <div class="card-header" v-if="card.title">
      <h3 class="card-title">{{ card.title }}</h3>
      <span class="card-section" v-if="card.section">{{ card.section }}</span>
    </div>

    <!-- 卡片正文 -->
    <div class="card-body">
      <!-- 纯文本内容 -->
      <div
        v-for="(block, idx) in card.content"
        :key="idx"
        class="content-block"
      >
        <!-- 文本段落 -->
        <div
          v-if="block.type === 'text'"
          class="text-block"
          v-html="renderLatex(block.value)"
        >
        </div>

        <!-- LaTeX 公式 -->
        <div
          v-else-if="block.type === 'latex'"
          class="latex-block"
          v-html="renderLatex(block.value)"
        >
        </div>

        <!-- 图片占位 -->
        <div
          v-else-if="block.type === 'image'"
          class="image-placeholder"
        >
          <div class="placeholder-inner">
            <span>[ 示意图 ]</span>
            <span class="placeholder-desc">{{ block.value }}</span>
          </div>
        </div>

        <!-- 思考题 -->
        <div
          v-else-if="block.type === 'question'"
          class="question-block"
        >
          <span class="question-label">思考：</span>
          <span v-html="renderLatex(block.value)"></span>
        </div>

        <!-- 动画嵌入位 -->
        <div
          v-else-if="block.type === 'animation'"
          class="animation-placeholder"
        >
          <div class="placeholder-inner">
            <span>[ 交互动画 ]</span>
            <span class="placeholder-desc">{{ block.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 选中唤起 AI -->
    <div class="card-ai-hint" v-if="card.aiHint">
      <span class="hint-text">{{ card.aiHint }}</span>
    </div>
  </div>
</template>

<style scoped>
.knowledge-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: var(--space-xl);
  transition: all 0.2s ease;
  cursor: default;
}

.knowledge-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border-light);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.card-section {
  font-size: 12px;
  color: var(--color-accent);
  font-weight: 500;
  background: var(--color-accent-light);
  padding: 2px 8px;
  border-radius: 4px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.content-block {
  line-height: 1.8;
}

.text-block {
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.8;
}

.text-block :deep(p) {
  margin-bottom: var(--space-sm);
}

.text-block :deep(ul),
.text-block :deep(ol) {
  padding-left: var(--space-lg);
  margin: var(--space-sm) 0;
}

.text-block :deep(li) {
  margin-bottom: var(--space-xs);
}

.latex-block {
  overflow-x: auto;
  padding: var(--space-sm) 0;
}

.image-placeholder {
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2xl);
  text-align: center;
  margin: var(--space-md) 0;
}

.animation-placeholder {
  background: var(--color-accent-bg);
  border: 2px dashed var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-2xl);
  text-align: center;
  margin: var(--space-md) 0;
}

.placeholder-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.placeholder-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.question-block {
  background: var(--color-accent-bg);
  border-left: 3px solid var(--color-accent);
  padding: var(--space-md);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 15px;
  color: var(--color-text-primary);
}

.question-label {
  font-weight: 600;
  color: var(--color-accent);
}

.card-ai-hint {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border-light);
}

.hint-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
</style>
