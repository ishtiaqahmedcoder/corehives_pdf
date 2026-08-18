<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SignPdfJob;
use App\Models\PdfJob;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SignController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:51200'],
            'signature' => ['required', 'file', 'mimes:png,jpg,jpeg', 'max:5120'],
            'page' => ['nullable', 'integer', 'min:0'],
        ]);

        $job = PdfJob::create([
            'tool_type' => 'sign',
            'status' => 'pending',
            'options' => ['page' => (string) $request->input('page', 0)],
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
            'expires_at' => now()->addHour(),
        ]);

        $disk = Storage::disk('local');
        $basePath = "pdf-jobs/{$job->id}/input";

        $this->storeInput($job, $disk, $basePath, $request->file('pdf'), 0);
        $this->storeInput($job, $disk, $basePath, $request->file('signature'), 1);

        SignPdfJob::dispatch($job->id)->onQueue('light');

        return response()->json(['job_id' => $job->id], 202);
    }

    private function storeInput(PdfJob $job, Filesystem $disk, string $basePath, UploadedFile $file, int $position): void
    {
        $extension = $file->getClientOriginalExtension() ?: 'bin';
        $storedPath = $file->storeAs($basePath, Str::uuid()->toString().'.'.$extension, 'local');

        $job->files()->create([
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $storedPath,
            'disk' => 'local',
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize(),
            'is_input' => true,
            'position' => $position,
            'expires_at' => $job->expires_at,
        ]);
    }
}
