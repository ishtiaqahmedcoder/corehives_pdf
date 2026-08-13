<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;
use ZipArchive;

class SplitService
{
    /**
     * Split every page of the input PDF into its own single-page PDF,
     * bundled into a single zip archive.
     */
    public function splitToZip(string $inputPath, string $tempDir, string $outputZipPath): void
    {
        $reader = new Fpdi();
        $pageCount = $reader->setSourceFile($inputPath);

        $zip = new ZipArchive();
        $zip->open($outputZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $pdf = new Fpdi();
            $pdf->SetAutoPageBreak(false);
            $pdf->setSourceFile($inputPath);

            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            $pagePath = "{$tempDir}/page-{$pageNo}.pdf";
            $pdf->Output('F', $pagePath);

            $zip->addFile($pagePath, "page-{$pageNo}.pdf");
        }

        $zip->close();
    }
}
