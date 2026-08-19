<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\CropImageService;
use App\Services\Image\GdImage;
use Illuminate\Contracts\Filesystem\Filesystem;

class CropImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $top = $this->toPx($job->options['top'] ?? 0);
        $right = $this->toPx($job->options['right'] ?? 0);
        $bottom = $this->toPx($job->options['bottom'] ?? 0);
        $left = $this->toPx($job->options['left'] ?? 0);

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/cropped.{$extension}";

        app(CropImageService::class)->crop($inputPath, $disk->path($outputRelativePath), $top, $right, $bottom, $left);

        return [
            ['path' => $outputRelativePath, 'name' => "cropped.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    private function toPx(mixed $value): int
    {
        return max(0, min((int) $value, 8000));
    }

    protected function friendlyError(): string
    {
        return 'Could not crop this image. Please make sure it is a valid JPG or PNG and the margins are not larger than the image.';
    }
}
