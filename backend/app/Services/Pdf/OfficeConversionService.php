<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class OfficeConversionService
{
    /**
     * Convert a document to $targetFormat (e.g. "pdf", "docx", "pptx", "xlsx")
     * using headless LibreOffice. Returns the absolute path of the produced file.
     */
    public function convert(string $inputPath, string $outputDir, string $targetFormat): string
    {
        $result = Process::timeout(120)->run([
            config('pdftools.libreoffice'),
            '--headless',
            '--norestore',
            '--convert-to', $targetFormat,
            '--outdir', $outputDir,
            $inputPath,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException('LibreOffice conversion failed: '.$result->errorOutput());
        }

        $baseName = pathinfo($inputPath, PATHINFO_FILENAME);
        $producedPath = "{$outputDir}/{$baseName}.{$targetFormat}";

        if (! file_exists($producedPath)) {
            throw new RuntimeException('Conversion did not produce an output file.');
        }

        return $producedPath;
    }
}
