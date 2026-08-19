<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\Process;
use RuntimeException;

class HtmlToImageService
{
    public function render(string $url, string $outputPath, string $format = 'jpg'): void
    {
        $this->assertSafeUrl($url);

        $result = Process::timeout(60)->run([
            config('pdftools.wkhtmltoimage'),
            '--format', $format,
            '--width', '1280',
            '--quality', '90',
            $url,
            $outputPath,
        ]);

        if (! $result->successful() || ! file_exists($outputPath)) {
            throw new RuntimeException('Could not render this page: '.$result->errorOutput());
        }
    }

    /**
     * Reject anything but a plain http(s) URL pointing at a public host, so this
     * tool cannot be used to make the server fetch internal/private addresses
     * (SSRF) — e.g. cloud metadata endpoints, localhost, or private LAN IPs.
     */
    private function assertSafeUrl(string $url): void
    {
        $parts = parse_url($url);

        if (! $parts || ! in_array($parts['scheme'] ?? '', ['http', 'https'], true) || empty($parts['host'])) {
            throw new RuntimeException('Enter a valid http:// or https:// URL.');
        }

        $host = $parts['host'];
        $ip = filter_var($host, FILTER_VALIDATE_IP) ? $host : gethostbyname($host);

        if ($ip === $host && ! filter_var($host, FILTER_VALIDATE_IP)) {
            throw new RuntimeException('Could not resolve this host.');
        }

        if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            throw new RuntimeException('This URL points to a private or reserved address and cannot be rendered.');
        }
    }
}
