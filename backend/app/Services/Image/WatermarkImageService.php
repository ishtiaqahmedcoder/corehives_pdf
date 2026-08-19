<?php

namespace App\Services\Image;

class WatermarkImageService
{
    public function apply(string $inputPath, string $outputPath, string $text): void
    {
        $font = base_path('resources/fonts/Anton-Regular.ttf');
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        $width = imagesx($image);
        $height = imagesy($image);

        imagealphablending($image, true);

        $fontSize = $this->fitFontSize($font, $text, $width * 0.8);
        $box = imagettfbbox($fontSize, 0, $font, $text);
        $textWidth = abs($box[4] - $box[0]);
        $textHeight = abs($box[5] - $box[1]);

        $x = (int) (($width - $textWidth) / 2);
        $y = (int) (($height + $textHeight) / 2);

        $shadow = imagecolorallocatealpha($image, 0, 0, 0, 95);
        $fill = imagecolorallocatealpha($image, 255, 255, 255, 65);

        imagettftext($image, $fontSize, 0, $x + 2, $y + 2, $shadow, $font, $text);
        imagettftext($image, $fontSize, 0, $x, $y, $fill, $font, $text);

        GdImage::save($image, $outputPath, $format);

        imagedestroy($image);
    }

    private function fitFontSize(string $font, string $text, float $maxWidth): int
    {
        $size = 120;
        while ($size > 10) {
            $box = imagettfbbox($size, 0, $font, $text);
            if (abs($box[4] - $box[0]) <= $maxWidth) {
                break;
            }
            $size -= 2;
        }

        return $size;
    }
}
