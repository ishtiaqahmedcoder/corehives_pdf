<?php

namespace App\Console\Commands;

use App\Models\PdfJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupExpiredFiles extends Command
{
    protected $signature = 'pdf:cleanup-expired';

    protected $description = 'Delete PDF jobs (and their files) past their expiry time';

    public function handle(): int
    {
        $expiredJobs = PdfJob::with('files')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expiredJobs as $job) {
            $disk = Storage::disk('local');
            $disk->deleteDirectory("pdf-jobs/{$job->id}");
            $job->delete();
        }

        $this->info("Cleaned up {$expiredJobs->count()} expired job(s).");

        return self::SUCCESS;
    }
}
