<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\ResizeImageService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ResizeImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $width = isset($job->options['width']) && $job->options['width'] !== '' ? (int) $job->options['width'] : null;
        $height = isset($job->options['height']) && $job->options['height'] !== '' ? (int) $job->options['height'] : null;

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/resized.{$extension}";

        app(ResizeImageService::class)->resize($inputPath, $disk->path($outputRelativePath), $width, $height);

        return [
            ['path' => $outputRelativePath, 'name' => "resized.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not resize this image. Please make sure it is a valid JPG or PNG file and try a smaller width or height.';
    }
}
