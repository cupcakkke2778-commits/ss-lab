<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRouter, useRoute } from 'vue-router'
import { computed, h } from 'vue'
import { NLayoutSider, NMenu, NButton, NIcon, NText } from 'naive-ui'
import { BookOpen, FlaskConical, Settings, ChevronLeft, MessageSquareText } from 'lucide-vue-next'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const menuOptions = computed(() => {
  const chapterMenus = store.chapters.map(ch => ({
    label: () => h('span', { style: 'font-size: 14px' }, `第${ch.id}章 ${ch.title}`),
    key: `chapter-${ch.id}`,
    icon: () => h(BookOpen, { size: 16 }),
    children: ch.sections.length > 0
      ? ch.sections.map(sec => ({
          label: () => h('span', { style: 'font-size: 13px; color: var(--color-text-secondary)' }, `${sec.id} ${sec.title}`),
          key: `section-${sec.id}`
        }))
      : undefined
  }))

  return [
    {
      type: 'group' as const,
      label: () => h('span', { style: 'font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-tertiary); padding: 0 8px' }, '理论课堂'),
      key: 'theory-group',
      children: chapterMenus
    },
    { type: 'divider' as const, key: 'divider-1' },
    {
      label: '仿真实验室',
      key: 'lab',
      icon: () => h(FlaskConical, { size: 16 })
    },
    { type: 'divider' as const, key: 'divider-2' },
    {
      label: '设置',
      key: 'settings',
      icon: () => h(Settings, { size: 16 })
    }
  ]
})

function handleMenuUpdate(key: string) {
  if (key === 'lab') {
    router.push('/lab')
  } else if (key === 'settings') {
    router.push('/settings')
  } else if (key.startsWith('chapter-')) {
    const id = parseInt(key.replace('chapter-', ''))
    store.setCurrentChapter(id)
    router.push(`/theory/${id}`)
  } else if (key.startsWith('section-')) {
    const sectionId = key.replace('section-', '')
    store.setCurrentSection(sectionId)
    const chapterId = parseInt(sectionId.split('.')[0])
    store.setCurrentChapter(chapterId)
    router.push(`/theory/${chapterId}#${sectionId}`)
  }
}

const activeKey = computed(() => {
  if (route.path.startsWith('/lab')) return 'lab'
  if (route.path.startsWith('/settings')) return 'settings'
  return `chapter-${store.currentChapter}`
})
</script>

<template>
  <NLayoutSider
    :width="260"
    :collapsed-width="0"
    :show-trigger="false"
    :collapsed="store.sidebarCollapsed"
    :native-scrollbar="false"
    class="app-sidebar"
    bordered
  >
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">S&S</span>
        <span class="logo-text">Lab</span>
      </div>
      <NButton
        quaternary
        circle
        size="small"
        @click="store.toggleSidebar"
        class="collapse-btn"
      >
        <template #icon>
          <NIcon><ChevronLeft /></NIcon>
        </template>
      </NButton>
    </div>

    <NMenu
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuUpdate"
      :collapsed="false"
      :collapsed-width="0"
      :indent="18"
      class="sidebar-menu"
    />

    <div class="sidebar-footer">
      <NButton
        quaternary
        size="small"
        @click="store.toggleAiChat"
        class="ai-quick-btn"
      >
        <template #icon>
          <NIcon><MessageSquareText /></NIcon>
        </template>
        AI 助手
      </NButton>
    </div>
  </NLayoutSider>
</template>

<style scoped>
.app-sidebar {
  height: 100vh;
  background: var(--color-bg-secondary) !important;
  border-right: 1px solid var(--color-border-light) !important;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.logo {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: -0.5px;
}

.logo-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.collapse-btn {
  color: var(--color-text-tertiary);
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-light);
}

.ai-quick-btn {
  width: 100%;
  justify-content: flex-start;
  color: var(--color-accent);
}
</style>
