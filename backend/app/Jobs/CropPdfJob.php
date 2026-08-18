<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\CropService;
use Illuminate\Contracts\Filesystem\Filesystem;

class CropPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $top = $this->toMm($job->options['top'] ?? 0);
        $right = $this->toMm($job->options['right'] ?? 0);
        $bottom = $this->toMm($job->options['bottom'] ?? 0);
        $left = $this->toMm($job->options['left'] ?? 0);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/cropped.pdf";
        app(CropService::class)->crop($inputPath, $top, $right, $bottom, $left, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'cropped.pdf'],
        ];
    }

    private function toMm(mixed $value): float
    {
        $mm = (float) $value;

        return max(0, min($mm, 200));
    }

    protected function friendlyError(): string
    {
        return 'Could not crop this PDF. Please make sure it is a valid, non-corrupted PDF and the margins are not larger than the page.';
    }
}
