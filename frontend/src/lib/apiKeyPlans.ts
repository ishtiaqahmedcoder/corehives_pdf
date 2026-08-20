// Mirrors ApiKey::PLAN_QUOTAS in backend/app/Models/ApiKey.php — keep in sync.
export const ApiKey = {
  free: 100,
  starter: 1000,
  pro: 10000,
} as const

export interface DeveloperPlan {
  key: keyof typeof ApiKey
  name: string
  price: string
  quota: number
  features: string[]
  highlight?: boolean
}

export const DEVELOPER_PLANS: DeveloperPlan[] = [
  { key: 'free', name: 'Free', price: '$0', quota: ApiKey.free, features: ['All PDF and image tools', 'Webhooks', 'Community support'] },
  { key: 'starter', name: 'Starter', price: '$19/mo', quota: ApiKey.starter, features: ['Everything in Free', 'Priority queue', 'Email support'], highlight: true },
  { key: 'pro', name: 'Pro', price: '$79/mo', quota: ApiKey.pro, features: ['Everything in Starter', 'Highest priority queue', 'Priority support'] },
]
