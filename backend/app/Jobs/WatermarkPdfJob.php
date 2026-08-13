<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\WatermarkService;
use Illuminate\Contracts\Filesystem\Filesystem;

class WatermarkPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $text = trim((string) ($job->options['text'] ?? ''));
        if ($text === '') {
            throw new \RuntimeException('Watermark text is required.');
        }

        $outputRelativePath = "pdf-jobs/{$job->id}/output/watermarked.pdf";
        app(WatermarkService::class)->apply($inputPath, $text, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'watermarked.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not add a watermark to this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
