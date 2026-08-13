<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\UnlockService;
use Illuminate\Contracts\Filesystem\Filesystem;

class UnlockPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $password = (string) ($job->options['password'] ?? '');

        $outputRelativePath = "pdf-jobs/{$job->id}/output/unlocked.pdf";
        app(UnlockService::class)->unlock($inputPath, $password, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'unlocked.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not unlock this PDF. Please check the password and try again.';
    }
}
