<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\HtmlToImageJob;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HtmlToImageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'url' => ['required', 'string', 'max:2048'],
            'format' => ['nullable', 'in:jpg,png'],
        ]);

        $apiKey = $request->attributes->get('apiKey');

        $job = PdfJob::create([
            'tool_type' => 'html-to-image',
            'status' => 'pending',
            'options' => [
                'url' => $request->input('url'),
                'format' => $request->input('format', 'jpg'),
            ],
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
            'api_key_id' => $apiKey?->id,
            'expires_at' => now()->addHour(),
        ]);

        HtmlToImageJob::dispatch($job->id)->onQueue('light');

        return response()->json(['job_id' => $job->id], 202);
    }
}
