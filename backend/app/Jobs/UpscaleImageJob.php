<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\UpscaleImageService;
use Illuminate\Contracts\Filesystem\Filesystem;

class UpscaleImageJob extends BasePdfJob
{
    public int $timeout = 150;

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/upscaled.{$extension}";

        app(UpscaleImageService::class)->upscale($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => "upscaled.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not upscale this image. Please make sure it is a valid JPG or PNG file and not too large.';
    }
}
