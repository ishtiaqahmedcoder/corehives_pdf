<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class RotateService
{
    /**
     * @param  string  $pagesSpec  qpdf page range spec, e.g. "1-z" for all pages, "1,3,5-7" for specific pages.
     */
    public function rotate(string $inputPath, string $pagesSpec, int $degrees, string $outputPath): void
    {
        $result = Process::run([
            config('pdftools.qpdf'),
            "--rotate=+{$degrees}:{$pagesSpec}",
            '--',
            $inputPath,
            $outputPath,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException('qpdf rotate failed: '.$result->errorOutput());
        }
    }
}
