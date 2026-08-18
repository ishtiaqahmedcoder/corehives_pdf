<?php

namespace App\Jobs;

use App\Models\PdfJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Throwable;

abstract class BasePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(public string $pdfJobId) {}

    public function handle(): void
    {
        $job = PdfJob::with('inputFiles')->findOrFail($this->pdfJobId);

        $job->update(['status' => 'processing', 'started_at' => now(), 'progress' => 10]);

        try {
            $disk = Storage::disk('local');
            $disk->makeDirectory("pdf-jobs/{$job->id}/output");

            $outputs = $this->process($job, $disk);

            $job->update(['progress' => 90]);

            foreach ($outputs as $position => $output) {
                $job->files()->create([
                    'original_name' => $output['name'],
                    'stored_path' => $output['path'],
                    'disk' => 'local',
                    'mime_type' => $output['mime'] ?? 'application/pdf',
                    'size_bytes' => $disk->size($output['path']),
                    'is_input' => false,
                    'position' => $position,
                    'expires_at' => $job->expires_at,
                ]);
            }

            $job->update([
                'status' => 'completed',
                'progress' => 100,
                'completed_at' => now(),
            ]);

            $this->fireWebhook($job);
        } catch (Throwable $e) {
            $job->update([
                'status' => 'failed',
                'error_message' => $this->friendlyError(),
            ]);
            report($e);

            $this->fireWebhook($job);
        }
    }

    /**
     * POST a completion/failure notification to the API key's registered
     * webhook, if this job was created via the public API and a webhook is
     * configured. Failures here never affect the job's own outcome.
     */
    private function fireWebhook(PdfJob $job): void
    {
        $job->loadMissing('apiKey');
        $webhookUrl = $job->apiKey?->webhook_url;

        if (! $webhookUrl) {
            return;
        }

        $downloadUrl = null;
        if ($job->status === 'completed') {
            $output = $job->outputFileRecords()->first();
            if ($output) {
                $downloadUrl = URL::temporarySignedRoute(
                    'jobs.download',
                    now()->addHours(24),
                    ['job' => $job->id, 'file' => $output->id]
                );
            }
        }

        try {
            Http::timeout(5)->post($webhookUrl, [
                'event' => $job->status === 'completed' ? 'task.completed' : 'task.failed',
                'data' => [
                    'job_id' => $job->id,
                    'tool' => $job->tool_type,
                    'status' => $job->status,
                    'download_url' => $downloadUrl,
                    'error_message' => $job->error_message,
                ],
            ]);
        } catch (Throwable $e) {
            report($e);
        }
    }

    /**
     * Run the tool and return a list of output files to attach to the job.
     * Each entry: ['path' => relative disk path, 'name' => download filename, 'mime' => optional mime type]
     *
     * @return array<int, array{path: string, name: string, mime?: string}>
     */
    abstract protected function process(PdfJob $job, \Illuminate\Contracts\Filesystem\Filesystem $disk): array;

    /**
     * Let a long-running process() report progress between the 10% (started)
     * and 90% (outputs saved) marks that handle() sets automatically.
     */
    protected function updateProgress(PdfJob $job, int $progress): void
    {
        $job->update(['progress' => max(10, min($progress, 89))]);
    }

    protected function friendlyError(): string
    {
        return 'Could not process your file(s). Please make sure they are valid, non-corrupted PDFs and try again.';
    }
}
