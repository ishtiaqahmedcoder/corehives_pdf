<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\RotateService;
use Illuminate\Contracts\Filesystem\Filesystem;

class RotatePdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $pages = trim((string) ($job->options['pages'] ?? '')) ?: '1-z';
        $degrees = (int) ($job->options['degrees'] ?? 90);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/rotated.pdf";
        app(RotateService::class)->rotate($inputPath, $pages, $degrees, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'rotated.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not rotate this PDF. Please check the page numbers and try again.';
    }
}
