<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\CompressImageService;
use App\Services\Image\GdImage;
use Illuminate\Contracts\Filesystem\Filesystem;

class CompressImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/compressed.{$extension}";

        app(CompressImageService::class)->compress($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => "compressed.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not compress this image. Please make sure it is a valid JPG, PNG, or GIF file.';
    }
}
