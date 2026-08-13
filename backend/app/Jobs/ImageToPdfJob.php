<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\ImageToPdfService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ImageToPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $imagePaths = $job->inputFiles->map(fn ($file) => $disk->path($file->stored_path))->all();

        $outputRelativePath = "pdf-jobs/{$job->id}/output/images.pdf";
        app(ImageToPdfService::class)->combine($imagePaths, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'images.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert these images to a PDF. Please make sure they are valid JPG or PNG files.';
    }
}
