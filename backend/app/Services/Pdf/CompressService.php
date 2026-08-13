<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class CompressService
{
    public function compress(string $inputPath, string $outputPath): void
    {
        $result = Process::run([
            config('pdftools.ghostscript'),
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.4',
            '-dPDFSETTINGS=/ebook',
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            "-sOutputFile={$outputPath}",
            $inputPath,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException('Ghostscript compression failed: '.$result->errorOutput());
        }
    }
}
