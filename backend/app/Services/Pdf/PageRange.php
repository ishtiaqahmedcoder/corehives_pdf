<?php

namespace App\Services\Pdf;

use InvalidArgumentException;

class PageRange
{
    /**
     * Parse a user-supplied page range like "1,3,5-7" into a sorted, deduped
     * list of 1-based page numbers, bounded to $totalPages.
     *
     * @return int[]
     */
    public static function parse(string $input, int $totalPages): array
    {
        $pages = [];

        foreach (explode(',', $input) as $part) {
            $part = trim($part);
            if ($part === '') {
                continue;
            }

            if (str_contains($part, '-')) {
                [$start, $end] = array_map('trim', explode('-', $part, 2));
                if (! ctype_digit($start) || ! ctype_digit($end)) {
                    throw new InvalidArgumentException("Invalid page range: \"{$part}\"");
                }
                $start = (int) $start;
                $end = (int) $end;
                if ($start > $end) {
                    [$start, $end] = [$end, $start];
                }
                for ($p = $start; $p <= $end; $p++) {
                    $pages[$p] = true;
                }
            } else {
                if (! ctype_digit($part)) {
                    throw new InvalidArgumentException("Invalid page number: \"{$part}\"");
                }
                $pages[(int) $part] = true;
            }
        }

        $pages = array_keys($pages);
        sort($pages);

        $pages = array_values(array_filter($pages, fn ($p) => $p >= 1 && $p <= $totalPages));

        if (empty($pages)) {
            throw new InvalidArgumentException('No valid pages selected.');
        }

        return $pages;
    }
}
