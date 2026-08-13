<?php

namespace App\Services\Pdf;

class WatermarkService
{
    public function apply(string $inputPath, string $text, string $outputPath): void
    {
        $pdf = new WatermarkPdf();
        $pdf->SetAutoPageBreak(false);
        $pageCount = $pdf->setSourceFile($inputPath);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            $pdf->SetFont('Helvetica', 'B', max(24, (int) ($size['width'] / 6)));
            $pdf->SetTextColor(190, 190, 190);

            $textWidth = $pdf->GetStringWidth($text);
            $centerX = $size['width'] / 2;
            $centerY = $size['height'] / 2;

            $pdf->RotatedText($centerX - $textWidth / 2, $centerY, $text, 45);
        }

        $pdf->Output('F', $outputPath);
    }
}
