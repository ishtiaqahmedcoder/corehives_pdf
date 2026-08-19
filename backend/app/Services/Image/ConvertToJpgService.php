<?php

namespace App\Services\Image;

class ConvertToJpgService
{
    public function convert(string $inputPath, string $outputPath): void
    {
        $image = GdImage::load($inputPath);
        $width = imagesx($image);
        $height = imagesy($image);

        // JPG has no alpha channel — flatten onto a white background first.
        $canvas = imagecreatetruecolor($width, $height);
        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefilledrectangle($canvas, 0, 0, $width, $height, $white);
        imagealphablending($canvas, true);
        imagecopy($canvas, $image, 0, 0, 0, 0, $width, $height);

        GdImage::save($canvas, $outputPath, 'jpeg', 90);

        imagedestroy($image);
        imagedestroy($canvas);
    }
}
