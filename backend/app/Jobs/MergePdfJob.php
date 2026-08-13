<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\MergeService;
use Illuminate\Contracts\Filesystem\Filesystem;

class MergePdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputPaths = $job->inputFiles->map(fn ($file) => $disk->path($file->stored_path))->all();

        $outputRelativePath = "pdf-jobs/{$job->id}/output/merged.pdf";

        app(MergeService::class)->merge($inputPaths, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'merged.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not merge these PDFs. Please make sure all files are valid, non-corrupted PDFs.';
    }
}
