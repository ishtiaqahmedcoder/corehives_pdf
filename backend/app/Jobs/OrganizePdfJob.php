<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PageSelectionService;
use Illuminate\Contracts\Filesystem\Filesystem;

class OrganizePdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $service = app(PageSelectionService::class);
        $totalPages = $service->pageCount($inputPath);

        $order = json_decode((string) ($job->options['order'] ?? '[]'), true);
        if (! is_array($order) || empty($order)) {
            throw new \RuntimeException('No page order was provided.');
        }

        $order = array_values(array_filter(
            array_map('intval', $order),
            fn ($p) => $p >= 1 && $p <= $totalPages
        ));

        if (empty($order)) {
            throw new \RuntimeException('The page order did not match this document.');
        }

        $outputRelativePath = "pdf-jobs/{$job->id}/output/organized.pdf";
        $service->extract($inputPath, $order, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'organized.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not organize this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
