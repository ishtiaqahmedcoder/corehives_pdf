<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class PageNumberService
{
    public function apply(string $inputPath, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pageCount = $pdf->setSourceFile($inputPath);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            $label = "{$pageNo} / {$pageCount}";

            $pdf->SetFont('Helvetica', '', 10);
            $pdf->SetTextColor(90, 90, 90);
            $pdf->SetXY(0, $size['height'] - 12);
            $pdf->Cell($size['width'], 10, $label, 0, 0, 'C');
        }

        $pdf->Output('F', $outputPath);
    }
}
