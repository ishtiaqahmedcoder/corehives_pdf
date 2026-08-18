<?php

namespace App\Services\Pdf;

use PhpOffice\PhpPresentation\IOFactory;
use PhpOffice\PhpPresentation\PhpPresentation;

class PdfToPresentationService
{
    public function __construct(private PdfTextExtractionService $extractor) {}

    public function convert(string $inputPath, string $outputPath): void
    {
        $pages = $this->extractor->extractPages($inputPath);

        $presentation = new PhpPresentation();

        foreach ($pages as $index => $text) {
            $slide = $index === 0 ? $presentation->getActiveSlide() : $presentation->createSlide();

            $shape = $slide->createRichTextShape();
            $shape->setHeight(500);
            $shape->setWidth(880);
            $shape->setOffsetX(20);
            $shape->setOffsetY(20);

            $content = trim($text) !== '' ? $text : ' ';
            foreach (preg_split('/\r\n|\r|\n/', $content) ?: [$content] as $line) {
                $shape->createTextRun($line);
                $shape->createBreak();
            }
        }

        IOFactory::createWriter($presentation, 'PowerPoint2007')->save($outputPath);
    }
}
