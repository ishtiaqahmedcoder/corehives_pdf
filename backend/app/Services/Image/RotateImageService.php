<?php

namespace App\Services\Image;

use RuntimeException;

class RotateImageService
{
    public function rotate(string $inputPath, string $outputPath, int $degrees): void
    {
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        imagealphablending($image, false);
        imagesavealpha($image, true);
        $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);

        // GD rotates counter-clockwise for a positive angle; negate so "90" reads as clockwise.
        $rotated = imagerotate($image, -$degrees, $transparent);

        if (! $rotated) {
            throw new RuntimeException('Could not rotate this image.');
        }

        imagesavealpha($rotated, true);
        GdImage::save($rotated, $outputPath, $format);

        imagedestroy($image);
        imagedestroy($rotated);
    }
}
