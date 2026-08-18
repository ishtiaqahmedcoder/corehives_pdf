<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class SignService
{
    /**
     * Overlay a signature image onto one page (bottom-right corner).
     *
     * @param  int  $pageNumber  1-based page number, or 0 for the last page.
     */
    public function sign(string $inputPath, string $signaturePath, int $pageNumber, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pageCount = $pdf->setSourceFile($inputPath);

        $targetPage = $pageNumber > 0 && $pageNumber <= $pageCount ? $pageNumber : $pageCount;

        [$imgWidthPx, $imgHeightPx] = getimagesize($signaturePath);
        $signatureWidthMm = 45;
        $signatureHeightMm = $signatureWidthMm * ($imgHeightPx / $imgWidthPx);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            if ($pageNo === $targetPage) {
                $margin = 12;
                $x = $size['width'] - $signatureWidthMm - $margin;
                $y = $size['height'] - $signatureHeightMm - $margin;
                $pdf->Image($signaturePath, $x, $y, $signatureWidthMm, $signatureHeightMm);
            }
        }

        $pdf->Output('F', $outputPath);
    }
}
