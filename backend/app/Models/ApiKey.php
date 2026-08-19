<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ApiKey extends Model
{
    protected $fillable = [
        'user_id', 'name', 'key_prefix', 'key_hash', 'plan',
        'monthly_quota', 'files_used_this_period', 'period_reset_at',
        'webhook_url', 'last_used_at', 'revoked_at',
    ];

    protected $casts = [
        'period_reset_at' => 'datetime',
        'last_used_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public const PLAN_QUOTAS = [
        'free' => 100,
        'starter' => 1000,
        'pro' => 10000,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pdfJobs(): HasMany
    {
        return $this->hasMany(PdfJob::class);
    }

    /**
     * Create a new key for a user. Returns the ApiKey model plus the
     * raw secret — the raw value is only ever available at creation time.
     *
     * @return array{key: ApiKey, rawKey: string}
     */
    public static function generate(User $user, string $name, string $plan = 'free'): array
    {
        $rawKey = 'pdfh_live_'.Str::random(40);

        $key = self::create([
            'user_id' => $user->id,
            'name' => $name,
            'key_prefix' => substr($rawKey, 0, 16),
            'key_hash' => hash('sha256', $rawKey),
            'plan' => $plan,
            'monthly_quota' => self::PLAN_QUOTAS[$plan] ?? self::PLAN_QUOTAS['free'],
            'files_used_this_period' => 0,
            'period_reset_at' => now()->addMonth(),
        ]);

        return ['key' => $key, 'rawKey' => $rawKey];
    }

    public function hasQuotaRemaining(): bool
    {
        return $this->files_used_this_period < $this->monthly_quota;
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }
}
