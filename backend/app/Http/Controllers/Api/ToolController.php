<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ExtractPagesPdfJob;
use App\Jobs\ImageToPdfJob;
use App\Jobs\PageNumbersPdfJob;
use App\Jobs\RemovePagesPdfJob;
use App\Jobs\SplitPdfJob;
use App\Jobs\WatermarkPdfJob;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ToolController extends Controller
{
    /**
     * Registry of "simple" tools: one queued job, straightforward file validation.
     * Tools with bespoke upload handling (e.g. merge) keep their own controller.
     */
    private const TOOLS = [
        'split' => ['job' => SplitPdfJob::class, 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf'],
        'remove-pages' => ['job' => RemovePagesPdfJob::class, 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf'],
        'extract-pages' => ['job' => ExtractPagesPdfJob::class, 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf'],
        'watermark' => ['job' => WatermarkPdfJob::class, 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf'],
        'page-numbers' => ['job' => PageNumbersPdfJob::class, 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf'],
        'jpg-to-pdf' => ['job' => ImageToPdfJob::class, 'min_files' => 1, 'max_files' => 30, 'mimes' => 'jpg,jpeg,png'],
    ];

    public function store(Request $request, string $tool): JsonResponse
    {
        abort_unless(isset(self::TOOLS[$tool]), 404, 'Unknown tool.');
        $config = self::TOOLS[$tool];

        $request->validate([
            'files' => ['required', 'array', "min:{$config['min_files']}", "max:{$config['max_files']}"],
            'files.*' => ['required', 'file', "mimes:{$config['mimes']}", 'max:51200'],
            'options' => ['sometimes', 'array'],
            'options.*' => ['nullable', 'string', 'max:500'],
        ]);

        $job = PdfJob::create([
            'tool_type' => $tool,
            'status' => 'pending',
            'options' => $request->input('options', []),
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
            'expires_at' => now()->addHour(),
        ]);

        $disk = Storage::disk('local');
        $basePath = "pdf-jobs/{$job->id}/input";

        foreach ($request->file('files') as $index => $file) {
            $extension = $file->getClientOriginalExtension() ?: 'pdf';
            $storedPath = $file->storeAs($basePath, Str::uuid()->toString().'.'.$extension, 'local');

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

        $config['job']::dispatch($job->id)->onQueue('light');

        return response()->json(['job_id' => $job->id], 202);
    }
}
