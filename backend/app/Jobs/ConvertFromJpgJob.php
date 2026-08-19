<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\ConvertFromJpgService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ConvertFromJpgJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $format = in_array($job->options['format'] ?? '', ['png', 'gif', 'webp'], true)
            ? $job->options['format']
            : 'png';

        $outputRelativePath = "pdf-jobs/{$job->id}/output/converted.{$format}";

        app(ConvertFromJpgService::class)->convert($inputPath, $disk->path($outputRelativePath), $format);

        return [
            ['path' => $outputRelativePath, 'name' => "converted.{$format}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert this image. Please make sure it is a valid JPG file.';
    }
}
