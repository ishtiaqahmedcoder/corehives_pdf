<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class UpscaleImageService
{
    /**
     * Upscale 4x using the bundled realesrgan-x4plus model. That model is
     * trained specifically for a 4x ratio, so the ratio isn't configurable
     * here — only the bundled model is shipped, to keep this download small.
     */
    public function upscale(string $inputPath, string $outputPath): void
    {
        $result = Process::timeout(120)->run([
            config('pdftools.realesrgan'),
            '-i', $inputPath,
            '-o', $outputPath,
            '-m', config('pdftools.realesrgan_models'),
            '-n', 'realesrgan-x4plus',
            '-s', '4',
        ]);

        if (! $result->successful() || ! file_exists($outputPath)) {
            throw new RuntimeException('Real-ESRGAN upscaling failed: '.$result->errorOutput());
        }
    }
}
