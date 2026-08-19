<?php

namespace App\Services\Image;

class MemeService
{
    public function generate(string $inputPath, string $outputPath, string $topText, string $bottomText): void
    {
        $font = base_path('resources/fonts/Anton-Regular.ttf');
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        $width = imagesx($image);
        $height = imagesy($image);
        $baseSize = max(16, (int) ($width / 10));

        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);

        $topText = trim($topText);
        $bottomText = trim($bottomText);

        if ($topText !== '') {
            $this->drawCaption($image, $font, mb_strtoupper($topText), $width, $baseSize, $baseSize + 12, $white, $black);
        }

        if ($bottomText !== '') {
            $this->drawCaption($image, $font, mb_strtoupper($bottomText), $width, $baseSize, $height - 18, $white, $black);
        }

        GdImage::save($image, $outputPath, $format);

        imagedestroy($image);
    }

    private function drawCaption(\GdImage $image, string $font, string $text, int $width, int $maxSize, int $y, int $fillColor, int $strokeColor): void
    {
        $size = $maxSize;
        while ($size > 10) {
            $box = imagettfbbox($size, 0, $font, $text);
            if (abs($box[4] - $box[0]) <= $width * 0.9) {
                break;
            }
            $size -= 2;
        }

        $box = imagettfbbox($size, 0, $font, $text);
        $textWidth = abs($box[4] - $box[0]);
        $x = (int) (($width - $textWidth) / 2);

        for ($dx = -2; $dx <= 2; $dx++) {
            for ($dy = -2; $dy <= 2; $dy++) {
                if ($dx === 0 && $dy === 0) {
                    continue;
                }
                imagettftext($image, $size, 0, $x + $dx, $y + $dy, $strokeColor, $font, $text);
            }
        }

        imagettftext($image, $size, 0, $x, $y, $fillColor, $font, $text);
    }
}
