<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\SplitService;
use Illuminate\Contracts\Filesystem\Filesystem;

class SplitPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $tempDir = $disk->path("pdf-jobs/{$job->id}/tmp-pages");
        $disk->makeDirectory("pdf-jobs/{$job->id}/tmp-pages");

        $outputRelativePath = "pdf-jobs/{$job->id}/output/split-pages.zip";

        app(SplitService::class)->splitToZip($inputPath, $tempDir, $disk->path($outputRelativePath));

        $disk->deleteDirectory("pdf-jobs/{$job->id}/tmp-pages");

        return [
            ['path' => $outputRelativePath, 'name' => 'split-pages.zip', 'mime' => 'application/zip'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not split this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
