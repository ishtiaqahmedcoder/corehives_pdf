<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\RemoveBackgroundService;
use Illuminate\Contracts\Filesystem\Filesystem;

class RemoveBackgroundJob extends BasePdfJob
{
    public int $timeout = 200;

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        // Always PNG: the cut-out subject needs a transparent background.
        $outputRelativePath = "pdf-jobs/{$job->id}/output/no-background.png";

        app(RemoveBackgroundService::class)->remove($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'no-background.png', 'mime' => 'image/png'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not remove the background from this image. Please make sure it is a valid JPG or PNG file.';
    }
}
