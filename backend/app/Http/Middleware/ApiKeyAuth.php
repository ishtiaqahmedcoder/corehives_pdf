<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyAuth
{
    /**
     * @param  string  $mode  "consume" (default) counts this request against
     *                        the key's monthly quota — use for job-creation
     *                        endpoints only. "read" just authenticates, for
     *                        status/polling endpoints that shouldn't cost quota.
     */
    public function handle(Request $request, Closure $next, string $mode = 'consume'): Response
    {
        $rawKey = $request->bearerToken();

        if (! $rawKey) {
            return response()->json([
                'error' => 'missing_api_key',
                'message' => 'Provide your API key as: Authorization: Bearer <key>',
            ], 401);
        }

        $apiKey = ApiKey::where('key_hash', hash('sha256', $rawKey))->first();

        if (! $apiKey || $apiKey->isRevoked()) {
            return response()->json([
                'error' => 'invalid_api_key',
                'message' => 'This API key is invalid or has been revoked.',
            ], 401);
        }

        if ($apiKey->period_reset_at && $apiKey->period_reset_at->isPast()) {
            $apiKey->update(['files_used_this_period' => 0, 'period_reset_at' => now()->addMonth()]);
        }

        if ($mode === 'consume') {
            if (! $apiKey->hasQuotaRemaining()) {
                return response()->json([
                    'error' => 'quota_exceeded',
                    'message' => "You've used all {$apiKey->monthly_quota} files in your {$apiKey->plan} plan for this period.",
                    'quota' => $apiKey->monthly_quota,
                    'used' => $apiKey->files_used_this_period,
                    'resets_at' => $apiKey->period_reset_at,
                ], 429);
            }

            $apiKey->increment('files_used_this_period');
        }

        $apiKey->update(['last_used_at' => now()]);

        $request->attributes->set('apiKey', $apiKey);

        return $next($request);
    }
}
