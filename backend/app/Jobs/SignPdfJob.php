<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\SignService;
use Illuminate\Contracts\Filesystem\Filesystem;

class SignPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $pdfFile = $job->inputFiles->first(fn ($f) => $f->mime_type === 'application/pdf');
        $signatureFile = $job->inputFiles->first(fn ($f) => $f->mime_type !== 'application/pdf');

        if (! $pdfFile || ! $signatureFile) {
            throw new \RuntimeException('Both a PDF and a signature image are required.');
        }

        $pageNumber = (int) ($job->options['page'] ?? 0);

        $outputRelativePath = "pdf-jobs/{$job->id}/output/signed.pdf";
        app(SignService::class)->sign(
            $disk->path($pdfFile->stored_path),
            $disk->path($signatureFile->stored_path),
            $pageNumber,
            $disk->path($outputRelativePath)
        );

        return [
            ['path' => $outputRelativePath, 'name' => 'signed.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not sign this PDF. Please make sure the file is a valid PDF and try again.';
    }
}
