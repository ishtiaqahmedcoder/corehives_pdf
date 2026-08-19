<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class BlurFaceService
{
    public function blur(string $inputPath, string $outputPath): void
    {
        $script = base_path('python/blur_faces.py');

        $result = Process::timeout(60)->run([
            config('pdftools.python'),
            $script,
            $inputPath,
            $outputPath,
        ]);

        if (! $result->successful() || ! file_exists($outputPath)) {
            throw new RuntimeException('Face blurring failed: '.$result->errorOutput());
        }
    }
}
