<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class MergeService
{
    /**
     * Merge PDFs (in the given order) into a single output file.
     *
     * @param  string[]  $inputPaths  Absolute paths to source PDFs, in merge order.
     */
    public function merge(array $inputPaths, string $outputPath): void
    {
        $pdf = new Fpdi();

        foreach ($inputPaths as $inputPath) {
            $pageCount = $pdf->setSourceFile($inputPath);

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                $templateId = $pdf->importPage($pageNo);
                $size = $pdf->getTemplateSize($templateId);

                $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
                $pdf->AddPage($orientation, [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);
            }
        }

        $pdf->Output('F', $outputPath);
    }
}
