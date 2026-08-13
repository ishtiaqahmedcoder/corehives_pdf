<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\OfficeConversionService;
use Illuminate\Contracts\Filesystem\Filesystem;

class OfficeConvertJob extends BasePdfJob
{
    public function __construct(
        string $pdfJobId,
        public string $targetFormat,
        public string $outputName,
        public string $mime
    ) {
        parent::__construct($pdfJobId);
    }

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);
        $outputDir = $disk->path("pdf-jobs/{$job->id}/output");

        $producedPath = app(OfficeConversionService::class)->convert($inputPath, $outputDir, $this->targetFormat);
        $relativePath = "pdf-jobs/{$job->id}/output/".basename($producedPath);

        return [
            ['path' => $relativePath, 'name' => $this->outputName, 'mime' => $this->mime],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert this file. Please make sure it is a valid, non-corrupted document.';
    }
}
