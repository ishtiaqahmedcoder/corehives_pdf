<?php

namespace App\Services\Pdf;

use Smalot\PdfParser\Parser;

class PdfTextExtractionService
{
    /**
     * @return string[] One text block per page, in page order.
     */
    public function extractPages(string $inputPath): array
    {
        $parser = new Parser();
        $document = $parser->parseFile($inputPath);

        $pages = [];
        foreach ($document->getPages() as $page) {
            $pages[] = $page->getText();
        }

        return $pages ?: [''];
    }
}
