<?php

namespace App\Services\Image;

use RuntimeException;

class GdImage
{
    public static function formatOf(string $path): string
    {
        $info = @getimagesize($path);

        if (! $info) {
            throw new RuntimeException('Not a valid image file.');
        }

        return match ($info['mime']) {
            'image/jpeg' => 'jpeg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            default => throw new RuntimeException('Unsupported image format.'),
        };
    }

    public static function load(string $path): \GdImage
    {
        $format = self::formatOf($path);

        $image = match ($format) {
            'jpeg' => imagecreatefromjpeg($path),
            'png' => imagecreatefrompng($path),
            'gif' => imagecreatefromgif($path),
            'webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($path) : null,
        };

        if (! $image) {
            throw new RuntimeException('Could not read this image.');
        }

        imagesavealpha($image, true);

        return $image;
    }

    public static function save(\GdImage $image, string $path, string $format, int $quality = 85): void
    {
        $ok = match ($format) {
            'jpeg', 'jpg' => imagejpeg($image, $path, $quality),
            'png' => imagepng($image, $path, (int) round((100 - $quality) / 100 * 9)),
            'gif' => imagegif($image, $path),
            'webp' => function_exists('imagewebp') ? imagewebp($image, $path, $quality) : false,
            default => false,
        };

        if (! $ok) {
            throw new RuntimeException('Could not save the output image.');
        }
    }

    /**
     * A truecolor canvas with alpha preserved, ready to receive a copied image.
     */
    public static function blankCanvas(int $width, int $height): \GdImage
    {
        $canvas = imagecreatetruecolor($width, $height);
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
        $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
        imagefilledrectangle($canvas, 0, 0, $width, $height, $transparent);

        return $canvas;
    }
}
