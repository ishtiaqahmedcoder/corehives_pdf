<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class CropService
{
    /**
     * Trim a fixed margin (in mm) off each side of every page.
     */
    public function crop(string $inputPath, float $top, float $right, float $bottom, float $left, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pageCount = $pdf->setSourceFile($inputPath);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $newWidth = max($size['width'] - $left - $right, 10);
            $newHeight = max($size['height'] - $top - $bottom, 10);

            $orientation = $newWidth > $newHeight ? 'L' : 'P';
            $pdf->AddPage($orientation, [$newWidth, $newHeight]);
            $pdf->useTemplate($templateId, -$left, -$top, $size['width'], $size['height']);
        }

        $pdf->Output('F', $outputPath);
    }
}
