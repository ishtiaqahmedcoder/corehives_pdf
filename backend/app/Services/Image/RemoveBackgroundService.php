<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class RemoveBackgroundService
{
    public function remove(string $inputPath, string $outputPath): void
    {
        $script = base_path('python/remove_background.py');

        $result = Process::timeout(180)->run([
            config('pdftools.python'),
            $script,
            $inputPath,
            $outputPath,
        ]);

        if (! $result->successful() || ! file_exists($outputPath)) {
            throw new RuntimeException('Background removal failed: '.$result->errorOutput());
        }
    }
}
