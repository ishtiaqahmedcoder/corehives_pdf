<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PdfToMarkdownService;
use Illuminate\Contracts\Filesystem\Filesystem;

class PdfToMarkdownJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/converted.md";

        app(PdfToMarkdownService::class)->convert($inputPath, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'converted.md', 'mime' => 'text/markdown'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert this PDF. Please make sure it is a valid, non-corrupted PDF with extractable text (scanned images need OCR first).';
    }
}
