<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\CompressService;
use Illuminate\Contracts\Filesystem\Filesystem;

class CompressPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/compressed.pdf";
        app(CompressService::class)->compress($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'compressed.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not compress this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
