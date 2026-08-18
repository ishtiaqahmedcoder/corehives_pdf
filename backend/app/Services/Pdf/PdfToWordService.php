<?php

namespace App\Services\Pdf;

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

class PdfToWordService
{
    public function __construct(private PdfTextExtractionService $extractor) {}

    public function convert(string $inputPath, string $outputPath): void
    {
        $pages = $this->extractor->extractPages($inputPath);

        $phpWord = new PhpWord();

        foreach ($pages as $index => $text) {
            $section = $phpWord->addSection();

            $lines = preg_split('/\r\n|\r|\n/', $text) ?: [];
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '') {
                    $section->addTextBreak();
                    continue;
                }
                $section->addText($line);
            }

            if ($index < count($pages) - 1) {
                $section->addPageBreak();
            }
        }

        IOFactory::createWriter($phpWord, 'Word2007')->save($outputPath);
    }
}
