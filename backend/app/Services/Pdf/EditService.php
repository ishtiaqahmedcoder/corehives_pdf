<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

class EditService
{
    /**
     * Overlay text elements onto one page of a PDF.
     *
     * @param  array<int, array{x: float, y: float, text: string, fontSize?: int, color?: string}>  $edits
     *         x/y are fractions (0-1) of the page width/height, from the top-left.
     */
    public function apply(string $inputPath, int $targetPage, array $edits, string $outputPath): void
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pageCount = $pdf->setSourceFile($inputPath);
        $targetPage = $targetPage >= 1 && $targetPage <= $pageCount ? $targetPage : 1;

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            if ($pageNo === $targetPage) {
                foreach ($edits as $edit) {
                    $text = trim((string) ($edit['text'] ?? ''));
                    if ($text === '') {
                        continue;
                    }

                    $fontSize = max(6, min((int) ($edit['fontSize'] ?? 14), 72));
                    [$r, $g, $b] = $this->parseColor((string) ($edit['color'] ?? '#111111'));

                    $x = max(0, min((float) ($edit['x'] ?? 0), 1)) * $size['width'];
                    $y = max(0, min((float) ($edit['y'] ?? 0), 1)) * $size['height'];

                    $pdf->SetFont('Helvetica', '', $fontSize);
                    $pdf->SetTextColor($r, $g, $b);
                    $pdf->SetXY($x, $y);
                    $pdf->Cell(0, $fontSize * 0.4, $text);
                }
            }
        }

        $pdf->Output('F', $outputPath);
    }

    /** @return array{0: int, 1: int, 2: int} */
    private function parseColor(string $hex): array
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) !== 6 || ! ctype_xdigit($hex)) {
            return [17, 17, 17];
        }

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
