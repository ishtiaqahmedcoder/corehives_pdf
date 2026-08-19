<?php

namespace App\Services\Image;

use RuntimeException;

class CropImageService
{
    public function crop(string $inputPath, string $outputPath, int $top, int $right, int $bottom, int $left): void
    {
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        $width = imagesx($image);
        $height = imagesy($image);

        $newWidth = $width - $left - $right;
        $newHeight = $height - $top - $bottom;

        if ($newWidth < 1 || $newHeight < 1) {
            throw new RuntimeException('These margins are larger than the image itself.');
        }

        $canvas = GdImage::blankCanvas($newWidth, $newHeight);
        imagecopy($canvas, $image, 0, 0, $left, $top, $newWidth, $newHeight);

        GdImage::save($canvas, $outputPath, $format);

        imagedestroy($image);
        imagedestroy($canvas);
    }
}
