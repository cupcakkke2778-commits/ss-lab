/**
 * API Key 安全存储模块
 *
 * 安全策略：
 * 1. 默认使用 sessionStorage（页面关闭自动清除）
 * 2. 可选"记住我"：使用 Web Crypto API 加密后存入 localStorage
 * 3. 加密密钥由用户设备 + 会话特征生成，不依赖外部服务
 * 4. 内存中的 key 优先于存储中的 key
 */

// 内存中的 API Key（最安全，页面刷新后需重新输入）
let inMemoryKey: string | null = null

// 存储键名
const STORAGE_KEY = 'ss-lab-encrypted-key'
const REMEMBER_KEY = 'ss-lab-remember'

/**
 * 生成加密密钥
 * 基于用户代理和屏幕特征生成设备指纹，确保加密密钥在不同设备上不同
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
  const deviceFingerprint = [
    navigator.userAgent,
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.language
  ].join('|')

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(deviceFingerprint),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('ss-lab-salt-2024'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * 加密 API Key
 */
async function encryptApiKey(apiKey: string): Promise<string> {
  const key = await generateEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(apiKey)
  )

  // 将 IV 和密文合并存储（IV 不需要保密）
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  // Base64 编码
  return btoa(String.fromCharCode(...combined))
}

/**
 * 解密 API Key
 */
async function decryptApiKey(encryptedData: string): Promise<string> {
  try {
    const key = await generateEncryptionKey()
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))

    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    )

    return new TextDecoder().decode(decrypted)
  } catch {
    throw new Error('API Key 解密失败，可能是在不同设备上读取')
  }
}

/**
 * 设置 API Key
 * @param apiKey API Key
 * @param remember 是否记住（加密存入 localStorage）
 */
export async function setApiKey(apiKey: string, remember: boolean = false): Promise<void> {
  inMemoryKey = apiKey

  if (remember) {
    const encrypted = await encryptApiKey(apiKey)
    localStorage.setItem(STORAGE_KEY, encrypted)
    localStorage.setItem(REMEMBER_KEY, 'true')
  } else {
    // 不记住则只存 sessionStorage
    sessionStorage.setItem(STORAGE_KEY, apiKey)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  }
}

/**
 * 获取 API Key
 * 优先级：内存 > sessionStorage > localStorage（加密）
 */
export async function getApiKey(): Promise<string> {
  // 1. 内存中最优先
  if (inMemoryKey) return inMemoryKey

  // 2. sessionStorage
  const sessionKey = sessionStorage.getItem(STORAGE_KEY)
  if (sessionKey) {
    inMemoryKey = sessionKey
    return sessionKey
  }

  // 3. localStorage（加密存储）
  const encryptedKey = localStorage.getItem(STORAGE_KEY)
  if (encryptedKey) {
    try {
      const decrypted = await decryptApiKey(encryptedKey)
      inMemoryKey = decrypted
      return decrypted
    } catch {
      // 解密失败，清除无效数据
      clearApiKey()
      return ''
    }
  }

  return ''
}

/**
 * 同步获取 API Key（用于不需要解密的场景）
 * 仅返回内存或 sessionStorage 中的 key
 */
export function getApiKeySync(): string {
  if (inMemoryKey) return inMemoryKey
  return sessionStorage.getItem(STORAGE_KEY) || ''
}

/**
 * 检查是否已配置 API Key
 */
export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey()
  return !!key
}

/**
 * 检查是否已配置 API Key（同步版本）
 */
export function hasApiKeySync(): boolean {
  return !!getApiKeySync() || !!localStorage.getItem(STORAGE_KEY)
}

/**
 * 检查是否启用了"记住我"
 */
export function isRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true'
}

/**
 * 清除 API Key（所有存储位置）
 */
export function clearApiKey(): void {
  inMemoryKey = null
  sessionStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(REMEMBER_KEY)
}
