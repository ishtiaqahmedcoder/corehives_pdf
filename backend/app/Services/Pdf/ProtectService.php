<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class ProtectService
{
    public function protect(string $inputPath, string $password, string $outputPath): void
    {
        $result = Process::run([
            config('pdftools.qpdf'),
            '--encrypt', $password, $password, '256',
            '--',
            $inputPath,
            $outputPath,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException('qpdf encrypt failed: '.$result->errorOutput());
        }
    }
}
