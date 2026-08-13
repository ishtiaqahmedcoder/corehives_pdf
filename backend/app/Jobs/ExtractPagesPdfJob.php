<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PageRange;
use App\Services\Pdf\PageSelectionService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ExtractPagesPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $service = app(PageSelectionService::class);
        $totalPages = $service->pageCount($inputPath);
        $pages = PageRange::parse($job->options['pages'] ?? '', $totalPages);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/extracted.pdf";
        $service->extract($inputPath, $pages, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'extracted.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not extract those pages. Please check the page numbers and try again.';
    }
}
