<?php

namespace App\Services\Image;

class CompressImageService
{
    public function compress(string $inputPath, string $outputPath, int $quality = 72): void
    {
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        GdImage::save($image, $outputPath, $format, $quality);

        imagedestroy($image);
    }
}
