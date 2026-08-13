<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PageNumberService;
use Illuminate\Contracts\Filesystem\Filesystem;

class PageNumbersPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/numbered.pdf";
        app(PageNumberService::class)->apply($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'numbered.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not add page numbers to this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
