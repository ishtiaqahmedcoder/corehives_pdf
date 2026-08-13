<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class OcrService
{
    /**
     * Rasterize each page (Ghostscript) then OCR it into a searchable
     * single-page PDF (Tesseract), and merge the pages back into one PDF.
     */
    public function makeSearchable(string $inputPath, string $tempDir, string $outputPath): void
    {
        $imagePattern = "{$tempDir}/page-%03d.png";

        $rasterize = Process::timeout(180)->run([
            config('pdftools.ghostscript'),
            '-sDEVICE=png16m',
            '-r300',
            '-dNOPAUSE',
            '-dBATCH',
            '-dQUIET',
            "-sOutputFile={$imagePattern}",
            $inputPath,
        ]);

        if (! $rasterize->successful()) {
            throw new RuntimeException('Could not rasterize PDF pages: '.$rasterize->errorOutput());
        }

        $images = glob("{$tempDir}/page-*.png");
        sort($images);

        if (empty($images)) {
            throw new RuntimeException('No pages found to OCR.');
        }

        $pagePdfs = [];
        foreach ($images as $index => $imagePath) {
            $outputBase = "{$tempDir}/ocr-page-".($index + 1);

            $ocr = Process::timeout(60)->run([
                config('pdftools.tesseract'),
                $imagePath,
                $outputBase,
                'pdf',
            ]);

            if (! $ocr->successful()) {
                throw new RuntimeException('Tesseract OCR failed: '.$ocr->errorOutput());
            }

            $pagePdfs[] = "{$outputBase}.pdf";
        }

        app(MergeService::class)->merge($pagePdfs, $outputPath);
    }
}
