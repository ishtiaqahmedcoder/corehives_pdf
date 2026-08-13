<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class ImageToPdfService
{
    /**
     * Combine images (in the given order) into a single PDF, one image per page.
     *
     * @param  string[]  $imagePaths
     */
    public function combine(array $imagePaths, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);

        foreach ($imagePaths as $imagePath) {
            [$widthPx, $heightPx] = getimagesize($imagePath);

            // Convert pixels to mm at 96 DPI, then clamp to A4 while preserving aspect ratio.
            $widthMm = $widthPx / 96 * 25.4;
            $heightMm = $heightPx / 96 * 25.4;

            $maxWidth = 210 - 20;
            $maxHeight = 297 - 20;

            $scale = min($maxWidth / $widthMm, $maxHeight / $heightMm, 1);
            $widthMm *= $scale;
            $heightMm *= $scale;

            $orientation = $widthMm > $heightMm ? 'L' : 'P';
            $pdf->AddPage($orientation);

            $pageWidth = $orientation === 'L' ? 297 : 210;
            $pageHeight = $orientation === 'L' ? 210 : 297;

            $x = ($pageWidth - $widthMm) / 2;
            $y = ($pageHeight - $heightMm) / 2;

            $pdf->Image($imagePath, $x, $y, $widthMm, $heightMm);
        }

        $pdf->Output('F', $outputPath);
    }
}
