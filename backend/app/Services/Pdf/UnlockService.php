<?php

namespace App\Services\Pdf;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class UnlockService
{
    public function unlock(string $inputPath, string $password, string $outputPath): void
    {
        $result = Process::run([
            config('pdftools.qpdf'),
            "--password={$password}",
            '--decrypt',
            $inputPath,
            $outputPath,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException('Incorrect password, or not a valid encrypted PDF.');
        }
    }
}
