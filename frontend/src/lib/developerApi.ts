import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'corehives-dev-token'

export const developerApi = axios.create({ baseURL: '/api' })

developerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface DeveloperUser {
  id: number
  name: string
  email: string
}

export interface ApiKeySummary {
  id: number
  name: string
  key_prefix: string
  plan: string
  monthly_quota: number
  files_used_this_period: number
  period_reset_at: string
  webhook_url: string | null
  last_used_at: string | null
  revoked: boolean
  created_at: string
}

export async function registerDeveloper(name: string, email: string, password: string) {
  const { data } = await developerApi.post<{ user: DeveloperUser; token: string }>('/auth/register', {
    name,
    email,
    password,
  })
  return data
}

export async function loginDeveloper(email: string, password: string) {
  const { data } = await developerApi.post<{ user: DeveloperUser; token: string }>('/auth/login', {
    email,
    password,
  })
  return data
}

export async function logoutDeveloper() {
  await developerApi.post('/auth/logout')
}

export async function fetchMe() {
  const { data } = await developerApi.get<{ user: DeveloperUser }>('/auth/me')
  return data.user
}

export async function listApiKeys() {
  const { data } = await developerApi.get<{ keys: ApiKeySummary[] }>('/developer/keys')
  return data.keys
}

export async function createApiKey(name: string) {
  const { data } = await developerApi.post<{ key: ApiKeySummary; rawKey: string }>('/developer/keys', { name })
  return data
}

export async function updateApiKeyWebhook(id: number, webhookUrl: string) {
  const { data } = await developerApi.patch<{ key: ApiKeySummary }>(`/developer/keys/${id}`, {
    webhook_url: webhookUrl || null,
  })
  return data.key
}

export async function revokeApiKey(id: number) {
  await developerApi.delete(`/developer/keys/${id}`)
}
