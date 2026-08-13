<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PageRange;
use App\Services\Pdf\PageSelectionService;
use Illuminate\Contracts\Filesystem\Filesystem;

class RemovePagesPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $service = app(PageSelectionService::class);
        $totalPages = $service->pageCount($inputPath);
        $toRemove = PageRange::parse($job->options['pages'] ?? '', $totalPages);

        $keep = array_values(array_diff(range(1, $totalPages), $toRemove));

        if (empty($keep)) {
            throw new \RuntimeException('Cannot remove every page from the document.');
        }

        $outputRelativePath = "pdf-jobs/{$job->id}/output/removed-pages.pdf";
        $service->extract($inputPath, $keep, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'removed-pages.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not remove those pages. Please check the page numbers and try again.';
    }
}
