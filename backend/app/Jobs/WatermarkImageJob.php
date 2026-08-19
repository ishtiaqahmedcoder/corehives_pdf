<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\WatermarkImageService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;

class WatermarkImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $text = trim((string) ($job->options['text'] ?? ''));
        if ($text === '') {
            throw new RuntimeException('Watermark text is required.');
        }

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/watermarked.{$extension}";

        app(WatermarkImageService::class)->apply($inputPath, $disk->path($outputRelativePath), $text);

        return [
            ['path' => $outputRelativePath, 'name' => "watermarked.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not watermark this image. Please make sure it is a valid JPG or PNG file.';
    }
}
