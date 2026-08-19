<?php

namespace App\Services\Image;

class PhotoEditorService
{
    /**
     * Overlay text elements onto an image.
     *
     * @param  array<int, array{x: float, y: float, text: string, fontSize?: int, color?: string}>  $edits
     *         x/y are fractions (0-1) of the image width/height, from the top-left.
     */
    public function apply(string $inputPath, array $edits, string $outputPath): void
    {
        $font = base_path('resources/fonts/Inter-Regular.ttf');
        $format = GdImage::formatOf($inputPath);
        $image = GdImage::load($inputPath);

        $width = imagesx($image);
        $height = imagesy($image);

        imagealphablending($image, true);

        foreach ($edits as $edit) {
            $text = trim((string) ($edit['text'] ?? ''));
            if ($text === '') {
                continue;
            }

            $fontSize = max(6, min((int) ($edit['fontSize'] ?? 20), 200));
            [$r, $g, $b] = $this->parseColor((string) ($edit['color'] ?? '#111111'));
            $color = imagecolorallocate($image, $r, $g, $b);

            $x = max(0, min((float) ($edit['x'] ?? 0), 1)) * $width;
            $y = max(0, min((float) ($edit['y'] ?? 0), 1)) * $height;

            imagettftext($image, $fontSize, 0, (int) $x, (int) $y, $color, $font, $text);
        }

        GdImage::save($image, $outputPath, $format);

        imagedestroy($image);
    }

    /** @return array{0: int, 1: int, 2: int} */
    private function parseColor(string $hex): array
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) !== 6 || ! ctype_xdigit($hex)) {
            return [17, 17, 17];
        }

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
