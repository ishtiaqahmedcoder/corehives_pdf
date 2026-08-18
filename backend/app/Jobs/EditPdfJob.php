<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\EditService;
use Illuminate\Contracts\Filesystem\Filesystem;

class EditPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $page = (int) ($job->options['page'] ?? 1);
        $edits = json_decode((string) ($job->options['edits'] ?? '[]'), true);

        if (! is_array($edits) || empty($edits)) {
            throw new \RuntimeException('No text was added to the page.');
        }

        $outputRelativePath = "pdf-jobs/{$job->id}/output/edited.pdf";
        app(EditService::class)->apply($inputPath, $page, $edits, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'edited.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not edit this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
