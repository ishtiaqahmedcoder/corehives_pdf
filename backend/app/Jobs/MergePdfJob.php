<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\MergeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MergePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(public string $pdfJobId) {}

    public function handle(MergeService $mergeService): void
    {
        $job = PdfJob::with('inputFiles')->findOrFail($this->pdfJobId);

        $job->update(['status' => 'processing', 'started_at' => now(), 'progress' => 10]);

        try {
            $disk = Storage::disk('local');
            $inputPaths = $job->inputFiles->map(fn ($file) => $disk->path($file->stored_path))->all();

            $job->update(['progress' => 40]);

            $outputRelativePath = "pdf-jobs/{$job->id}/output/merged.pdf";
            $disk->makeDirectory("pdf-jobs/{$job->id}/output");

            $mergeService->merge($inputPaths, $disk->path($outputRelativePath));

            $job->update(['progress' => 90]);

            $job->files()->create([
                'original_name' => 'merged.pdf',
                'stored_path' => $outputRelativePath,
                'disk' => 'local',
                'mime_type' => 'application/pdf',
                'size_bytes' => $disk->size($outputRelativePath),
                'is_input' => false,
                'expires_at' => $job->expires_at,
            ]);

            $job->update([
                'status' => 'completed',
                'progress' => 100,
                'completed_at' => now(),
            ]);
        } catch (Throwable $e) {
            $job->update([
                'status' => 'failed',
                'error_message' => 'Could not merge these PDFs. Please make sure all files are valid, non-corrupted PDFs.',
            ]);
            report($e);
        }
    }
}
