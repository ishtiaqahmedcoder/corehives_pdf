<?php

namespace App\Services\Pdf;

class PdfToMarkdownService
{
    public function convert(string $inputPath, string $outputPath): void
    {
        $pages = app(PdfTextExtractionService::class)->extractPages($inputPath);

        $sections = [];
        foreach ($pages as $index => $text) {
            $text = trim($text);
            $sections[] = "## Page ".($index + 1)."\n\n".($text !== '' ? $this->toMarkdownParagraphs($text) : '_No extractable text on this page._');
        }

        file_put_contents($outputPath, implode("\n\n", $sections)."\n");
    }

    private function toMarkdownParagraphs(string $text): string
    {
        $lines = preg_split('/\r\n|\r|\n/', $text);
        $paragraphs = array_filter(array_map('trim', $lines), fn ($line) => $line !== '');

        return implode("\n\n", $paragraphs);
    }
}
