<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\RotateImageService;
use Illuminate\Contracts\Filesystem\Filesystem;

class RotateImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $degrees = (int) ($job->options['degrees'] ?? 90);

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/rotated.{$extension}";

        app(RotateImageService::class)->rotate($inputPath, $disk->path($outputRelativePath), $degrees);

        return [
            ['path' => $outputRelativePath, 'name' => "rotated.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not rotate this image. Please make sure it is a valid JPG or PNG file.';
    }
}
