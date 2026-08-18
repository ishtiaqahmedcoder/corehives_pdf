<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\PdfToPresentationService;
use App\Services\Pdf\PdfToSpreadsheetService;
use App\Services\Pdf\PdfToWordService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;

class PdfToOfficeJob extends BasePdfJob
{
    public function __construct(
        string $pdfJobId,
        public string $format,
        public string $outputName,
        public string $mime
    ) {
        parent::__construct($pdfJobId);
    }

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);
        $outputRelativePath = "pdf-jobs/{$job->id}/output/{$this->outputName}";
        $outputAbsolutePath = $disk->path($outputRelativePath);

        match ($this->format) {
            'docx' => app(PdfToWordService::class)->convert($inputPath, $outputAbsolutePath),
            'pptx' => app(PdfToPresentationService::class)->convert($inputPath, $outputAbsolutePath),
            'xlsx' => app(PdfToSpreadsheetService::class)->convert($inputPath, $outputAbsolutePath),
            default => throw new RuntimeException('Unsupported target format.'),
        };

        return [
            ['path' => $outputRelativePath, 'name' => $this->outputName, 'mime' => $this->mime],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not convert this PDF. Please make sure it is a valid, non-corrupted PDF with extractable text (scanned images need OCR first).';
    }
}
