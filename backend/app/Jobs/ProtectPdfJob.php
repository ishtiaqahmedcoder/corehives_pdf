<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\ProtectService;
use Illuminate\Contracts\Filesystem\Filesystem;

class ProtectPdfJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $password = (string) ($job->options['password'] ?? '');
        if ($password === '') {
            throw new \RuntimeException('A password is required.');
        }

        $outputRelativePath = "pdf-jobs/{$job->id}/output/protected.pdf";
        app(ProtectService::class)->protect($inputPath, $password, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => 'protected.pdf'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not protect this PDF. Please make sure it is a valid, non-corrupted PDF.';
    }
}
