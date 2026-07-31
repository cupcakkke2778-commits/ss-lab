import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/theory/1'
  },
  {
    path: '/theory/:chapterId?',
    name: 'Theory',
    component: () => import('@/components/theory/TheoryView.vue')
  },
  {
    path: '/lab',
    name: 'Lab',
    component: () => import('@/components/lab/LabView.vue')
  },
  {
    path: '/lab/:id',
    name: 'LabDetail',
    component: () => import('@/components/lab/LabDetail.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/components/settings/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
