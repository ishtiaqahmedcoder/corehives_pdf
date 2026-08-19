<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\HtmlToImageService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;

class HtmlToImageJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $url = trim((string) ($job->options['url'] ?? ''));
        if ($url === '') {
            throw new RuntimeException('A URL is required.');
        }

        $format = in_array($job->options['format'] ?? '', ['jpg', 'png'], true) ? $job->options['format'] : 'jpg';

        $outputRelativePath = "pdf-jobs/{$job->id}/output/page.{$format}";

        app(HtmlToImageService::class)->render($url, $disk->path($outputRelativePath), $format);

        return [
            ['path' => $outputRelativePath, 'name' => "page.{$format}", 'mime' => $format === 'jpg' ? 'image/jpeg' : 'image/png'],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not render this page. Please check the URL and try again.';
    }
}
