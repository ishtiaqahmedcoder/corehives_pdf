<?php

namespace App\Http\Controllers\Api\Developer;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $keys = $request->user()->apiKeys()->latest()->get()->map(
            fn (ApiKey $key) => $this->present($key)
        );

        return response()->json(['keys' => $keys]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
        ]);

        $existing = $request->user()->apiKeys()->whereNull('revoked_at')->count();
        abort_if($existing >= 10, 422, 'You can have at most 10 active API keys.');

        ['key' => $key, 'rawKey' => $rawKey] = ApiKey::generate($request->user(), $validated['name']);

        return response()->json([
            'key' => $this->present($key),
            'rawKey' => $rawKey,
        ], 201);
    }

    public function update(Request $request, ApiKey $apiKey): JsonResponse
    {
        abort_unless($apiKey->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'webhook_url' => ['nullable', 'url', 'max:255'],
        ]);

        $apiKey->update(['webhook_url' => $validated['webhook_url'] ?? null]);

        return response()->json(['key' => $this->present($apiKey->fresh())]);
    }

    public function destroy(Request $request, ApiKey $apiKey): JsonResponse
    {
        abort_unless($apiKey->user_id === $request->user()->id, 403);

        $apiKey->update(['revoked_at' => now()]);

        return response()->json(['message' => 'Key revoked.']);
    }

    private function present(ApiKey $key): array
    {
        return [
            'id' => $key->id,
            'name' => $key->name,
            'key_prefix' => $key->key_prefix.'…',
            'plan' => $key->plan,
            'monthly_quota' => $key->monthly_quota,
            'files_used_this_period' => $key->files_used_this_period,
            'period_reset_at' => $key->period_reset_at,
            'webhook_url' => $key->webhook_url,
            'last_used_at' => $key->last_used_at,
            'revoked' => $key->isRevoked(),
            'created_at' => $key->created_at,
        ];
    }
}
