<?php

namespace App\Services\Pdf;

use setasign\Fpdi\Fpdi;

/**
 * Fpdi subclass adding rotated text drawing, using the well-known
 * fpdf.org "Rotation" script technique (content-stream rotation matrix).
 */
class WatermarkPdf extends Fpdi
{
    protected float $angle = 0;

    public function RotatedText(float $x, float $y, string $txt, float $angle): void
    {
        $this->Rotate($angle, $x, $y);
        $this->Text($x, $y, $txt);
        $this->Rotate(0);
    }

    protected function Rotate(float $angle, ?float $x = null, ?float $y = null): void
    {
        $x ??= $this->x;
        $y ??= $this->y;

        if ($this->angle !== 0.0) {
            $this->_out('Q');
        }

        $this->angle = $angle;

        if ($angle !== 0.0) {
            $radians = $angle * M_PI / 180;
            $c = cos($radians);
            $s = sin($radians);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;

            $this->_out(sprintf(
                'q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',
                $c,
                $s,
                -$s,
                $c,
                $cx,
                $cy,
                -$cx,
                -$cy
            ));
        }
    }

    protected function _endpage(): void
    {
        if ($this->angle !== 0.0) {
            $this->angle = 0;
            $this->_out('Q');
        }

        parent::_endpage();
    }
}
