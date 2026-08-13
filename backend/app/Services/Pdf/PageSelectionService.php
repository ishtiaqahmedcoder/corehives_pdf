<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class PageSelectionService
{
    public function pageCount(string $inputPath): int
    {
        $pdf = new Fpdi();

        return $pdf->setSourceFile($inputPath);
    }

    /**
     * Build a new PDF containing only the given 1-based page numbers, in order.
     *
     * @param  int[]  $pages
     */
    public function extract(string $inputPath, array $pages, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pdf->setSourceFile($inputPath);

        foreach ($pages as $pageNo) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);
        }

        $pdf->Output('F', $outputPath);
    }
}
