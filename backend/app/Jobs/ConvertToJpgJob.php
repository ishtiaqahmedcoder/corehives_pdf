<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\ConvertToJpgService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ConvertToJpgJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/converted.jpg";

        app(ConvertToJpgService::class)->convert($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'converted.jpg', 'mime' => 'image/jpeg'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert this image. Please make sure it is a valid PNG or GIF file.';
    }
}
