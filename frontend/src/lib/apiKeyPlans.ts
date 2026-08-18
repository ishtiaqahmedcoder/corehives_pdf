// Mirrors ApiKey::PLAN_QUOTAS in backend/app/Models/ApiKey.php — keep in sync.
export const ApiKey = {
  free: 100,
  starter: 1000,
  pro: 10000,
} as const
