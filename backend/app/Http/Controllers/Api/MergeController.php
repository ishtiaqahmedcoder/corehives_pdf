<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\MergePdfJob;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MergeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'files' => ['required', 'array', 'min:2', 'max:20'],
            'files.*' => ['required', 'file', 'mimes:pdf', 'max:51200'],
        ]);

        $apiKey = $request->attributes->get('apiKey');

        $job = PdfJob::create([
            'tool_type' => 'merge',
            'status' => 'pending',
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
            'api_key_id' => $apiKey?->id,
            'expires_at' => now()->addHour(),
        ]);

        $disk = Storage::disk('local');
        $basePath = "pdf-jobs/{$job->id}/input";

        foreach ($request->file('files') as $index => $file) {
            $storedPath = $file->storeAs($basePath, Str::uuid()->toString().'.pdf', 'local');

            $job->files()->create([
                'original_name' => $file->getClientOriginalName(),
                'stored_path' => $storedPath,
                'disk' => 'local',
                'mime_type' => $file->getClientMimeType(),
                'size_bytes' => $file->getSize(),
                'is_input' => true,
                'position' => $index,
                'expires_at' => $job->expires_at,
            ]);
        }

        MergePdfJob::dispatch($job->id)->onQueue('light');

        return response()->json(['job_id' => $job->id], 202);
    }
}
