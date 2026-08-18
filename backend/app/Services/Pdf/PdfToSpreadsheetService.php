<?php

namespace App\Services\Pdf;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PdfToSpreadsheetService
{
    public function __construct(private PdfTextExtractionService $extractor) {}

    public function convert(string $inputPath, string $outputPath): void
    {
        $pages = $this->extractor->extractPages($inputPath);

        $spreadsheet = new Spreadsheet();
        $spreadsheet->removeSheetByIndex(0);

        foreach ($pages as $pageIndex => $text) {
            $sheet = $spreadsheet->createSheet();
            $sheet->setTitle('Page '.($pageIndex + 1));

            $row = 1;
            foreach (preg_split('/\r\n|\r|\n/', $text) ?: [] as $line) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                // Split on runs of 2+ spaces / tabs, a common heuristic for
                // table-like columns in extracted PDF text.
                $cells = preg_split('/\s{2,}|\t+/', $line) ?: [$line];
                $col = 1;
                foreach ($cells as $cell) {
                    $sheet->setCellValue([$col, $row], $cell);
                    $col++;
                }
                $row++;
            }
        }

        (new Xlsx($spreadsheet))->save($outputPath);
    }
}
