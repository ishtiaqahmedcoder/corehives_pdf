<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\OcrService;
use Illuminate\Contracts\Filesystem\Filesystem;

class OcrPdfJob extends BasePdfJob
{
    public int $timeout = 300;

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $tempRelative = "pdf-jobs/{$job->id}/tmp-ocr";
        $disk->makeDirectory($tempRelative);
        $tempDir = $disk->path($tempRelative);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/searchable.pdf";
        app(OcrService::class)->makeSearchable($inputPath, $tempDir, $disk->path($outputRelativePath));

        $disk->deleteDirectory($tempRelative);

        return [
            ['path' => $outputRelativePath, 'name' => 'searchable.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not OCR this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
