<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\BlurFaceService;
use App\Services\Image\GdImage;
use Illuminate\Contracts\Filesystem\Filesystem;

class BlurFaceJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/blurred.{$extension}";

        app(BlurFaceService::class)->blur($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => "blurred.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not process this image. Please make sure it is a valid JPG or PNG file.';
    }
}
