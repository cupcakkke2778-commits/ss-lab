import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Chapter {
  id: number
  title: string
  sections: Section[]
}

export interface Section {
  id: string
  title: string
  subsections?: Subsection[]
}

export interface Subsection {
  id: string
  title: string
}

export const useAppStore = defineStore('app', () => {
  // 当前章节
  const currentChapter = ref<number>(1)
  const currentSection = ref<string>('')

  // AI 对话窗口状态
  const aiChatVisible = ref(false)
  const aiChatCollapsed = ref(true)

  // 当前 AI 模式
  const aiMode = ref<string>('全能学习')

  // 侧边栏状态
  const sidebarCollapsed = ref(false)

  // 章节数据
  const chapters = ref<Chapter[]>([
    {
      id: 1,
      title: '信号与系统',
      sections: [
        { id: '1.1', title: '信号的描述' },
        { id: '1.2', title: '信号的自变量变换' },
        { id: '1.3', title: '复指数信号与正弦信号' },
        { id: '1.4', title: '单位冲激信号和单位阶跃信号' },
        { id: '1.5', title: '连续时间和离散时间系统' },
        { id: '1.6', title: '系统的基本性质' },
        { id: '1.7', title: '第一章小结' }
      ]
    },
    {
      id: 2,
      title: '线性时不变系统',
      sections: []
    },
    {
      id: 3,
      title: '周期信号的傅里叶级数表示',
      sections: []
    },
    {
      id: 4,
      title: '连续时间傅里叶变换',
      sections: []
    },
    {
      id: 5,
      title: '离散时间傅里叶变换',
      sections: []
    },
    {
      id: 6,
      title: '信号与系统的时域和频域特性',
      sections: []
    },
    {
      id: 7,
      title: '采样',
      sections: []
    },
    {
      id: 9,
      title: '拉普拉斯变换',
      sections: []
    },
    {
      id: 10,
      title: 'Z变换',
      sections: []
    }
  ])

  // 仿真实验室动画列表
  const labAnimations = ref([
    { id: 1, title: '信号卷积模拟器', description: '连续信号卷积积分交互动画' },
    { id: 2, title: '离散卷积和可视化', description: '离散序列卷积和滑动演示动画' },
    { id: 3, title: '信号时域尺度变换', description: '时移/反转/尺度缩放一体化实验室' },
    { id: 4, title: '傅里叶级数谐波合成', description: '方波与三角波 · 吉布斯现象可视化' },
    { id: 5, title: '傅里叶变换对演示', description: '时域↔频域联动 · 支持自定义信号' },
    { id: 6, title: '奈奎斯特抽样定理', description: '方波专用演示 · 混叠失真对比' },
    { id: 7, title: 'AM幅度调制与解调', description: '频谱搬移 · 通信原理联合教学' },
    { id: 8, title: 's平面零极点分析', description: '共轭极点对 · 智能镜像联动' },
    { id: 9, title: 'z平面零极点分析', description: '离散序列动画 · 收敛域/稳定性' },
    { id: 10, title: '滤波器分析', description: '低通/高通/带通/带阻 · 巴特沃斯' },
    { id: 11, title: 'LTI系统完整分析', description: '连续/离散 · 时域/频域/复频域' }
  ])

  // 当前选中的文本（用于AI提问）
  const selectedText = ref<string>('')

  // 计算属性
  const currentChapterData = computed(() =>
    chapters.value.find(c => c.id === currentChapter.value)
  )

  // 方法
  function setCurrentChapter(id: number) {
    currentChapter.value = id
  }

  function setCurrentSection(id: string) {
    currentSection.value = id
  }

  function toggleAiChat() {
    aiChatCollapsed.value = !aiChatCollapsed.value
    if (!aiChatCollapsed.value) {
      aiChatVisible.value = true
    }
  }

  function setAiMode(mode: string) {
    aiMode.value = mode
  }

  function setSelectedText(text: string) {
    selectedText.value = text
    aiChatCollapsed.value = false
    aiChatVisible.value = true
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    currentChapter,
    currentSection,
    aiChatVisible,
    aiChatCollapsed,
    aiMode,
    sidebarCollapsed,
    chapters,
    labAnimations,
    selectedText,
    currentChapterData,
    setCurrentChapter,
    setCurrentSection,
    toggleAiChat,
    setAiMode,
    setSelectedText,
    toggleSidebar
  }
})
