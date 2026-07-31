<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AiChatPanel from '@/components/ai-chat/AiChatPanel.vue'
import { useAppStore } from '@/stores/app'
import { NLayout, NLayoutContent } from 'naive-ui'

const store = useAppStore()
</script>

<template>
  <NLayout class="app-layout" has-sider>
    <AppSidebar />

    <NLayout>
      <NLayoutContent class="main-content" :native-scrollbar="false">
        <router-view />
      </NLayoutContent>
    </NLayout>

    <AiChatPanel />
  </NLayout>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  width: 100vw;
}

.main-content {
  height: 100vh;
  background: var(--color-bg);
  overflow-y: auto;
  padding: 0;
}
</style>
