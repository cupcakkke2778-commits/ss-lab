/**
 * AI 提示词配置加载器
 * 动态加载 8 种模式的提示词配置文件
 */

export interface AiPromptConfig {
  mode: string
  systemPrompt: string
}

const promptModules = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const modeMap: Record<string, string> = {
  '01-quanxue': '全能学习',
  '02-sujiladi': '苏格拉底启发',
  '03-qimobeikao': '期末备考',
  '04-matlab': 'MATLAB 实验',
  '05-xitijingjiang': '习题精讲',
  '06-cuotizhenduan': '错题诊断',
  '07-tikulianxi': '题库练习',
  '08-donghuashengcheng': '动画生成'
}

/**
 * 获取全局规则
 */
export function getGlobalRules(): string {
  return promptModules['./global-rules.md'] || ''
}

/**
 * 获取指定模式的完整 System Prompt
 */
export function getModePrompt(modeName: string): AiPromptConfig | null {
  const globalRules = getGlobalRules()

  for (const [file, content] of Object.entries(promptModules)) {
    const mode = modeMap[file.replace('./', '').replace('.md', '')]
    if (mode === modeName) {
      return {
        mode: modeName,
        systemPrompt: `${globalRules}\n\n${content}`
      }
    }
  }
  return null
}

/**
 * 获取所有可用模式列表
 */
export function getAllModes(): string[] {
  return Object.values(modeMap)
}

/**
 * 获取所有模式的完整配置
 */
export function getAllModePrompts(): AiPromptConfig[] {
  const globalRules = getGlobalRules()
  return Object.entries(promptModules)
    .filter(([file]) => file !== './global-rules.md')
    .map(([file, content]) => {
      const mode = modeMap[file.replace('./', '').replace('.md', '')]
      return {
        mode: mode || file,
        systemPrompt: `${globalRules}\n\n${content}`
      }
    })
}
