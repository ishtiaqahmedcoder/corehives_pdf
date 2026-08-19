<?php

namespace App\Services\Image;

use RuntimeException;

class ConvertFromJpgService
{
    private const ALLOWED = ['png', 'gif', 'webp'];

    public function convert(string $inputPath, string $outputPath, string $targetFormat): void
    {
        if (! in_array($targetFormat, self::ALLOWED, true)) {
            throw new RuntimeException('Unsupported target format.');
        }

        if ($targetFormat === 'webp' && ! function_exists('imagewebp')) {
            throw new RuntimeException('WEBP output is not supported on this server.');
        }

        $image = GdImage::load($inputPath);
        GdImage::save($image, $outputPath, $targetFormat);

        imagedestroy($image);
    }
}
