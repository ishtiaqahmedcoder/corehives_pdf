<?php

namespace App\Services\Image;

use RuntimeException;

class ResizeImageService
{
    public function resize(string $inputPath, string $outputPath, ?int $targetWidth, ?int $targetHeight): void
    {
        if (! $targetWidth && ! $targetHeight) {
            throw new RuntimeException('Provide a width or a height.');
        }

        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        $sourceWidth = imagesx($image);
        $sourceHeight = imagesy($image);

        if ($targetWidth && ! $targetHeight) {
            $targetHeight = (int) round($sourceHeight * ($targetWidth / $sourceWidth));
        } elseif ($targetHeight && ! $targetWidth) {
            $targetWidth = (int) round($sourceWidth * ($targetHeight / $sourceHeight));
        }

        $targetWidth = max(1, min($targetWidth, 8000));
        $targetHeight = max(1, min($targetHeight, 8000));

        $canvas = GdImage::blankCanvas($targetWidth, $targetHeight);
        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);

        GdImage::save($canvas, $outputPath, $format);

        imagedestroy($image);
        imagedestroy($canvas);
    }
}
