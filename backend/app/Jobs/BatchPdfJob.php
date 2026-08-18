<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Pdf\CompressService;
use App\Services\Pdf\CropService;
use App\Services\Pdf\PageNumberService;
use App\Services\Pdf\ProtectService;
use App\Services\Pdf\RotateService;
use App\Services\Pdf\UnlockService;
use App\Services\Pdf\WatermarkService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;
use Throwable;
use ZipArchive;

class BatchPdfJob extends BasePdfJob
{
    public int $timeout = 600;

    private const SUPPORTED_TOOLS = [
        'compress', 'rotate', 'watermark', 'page-numbers', 'crop', 'protect', 'unlock',
    ];

    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $targetTool = (string) ($job->options['batch_tool'] ?? '');
        if (! in_array($targetTool, self::SUPPORTED_TOOLS, true)) {
            throw new RuntimeException('This tool does not support batch processing.');
        }

        $toolOptions = json_decode((string) ($job->options['tool_options'] ?? '{}'), true);
        $toolOptions = is_array($toolOptions) ? $toolOptions : [];

        $tempRelative = "pdf-jobs/{$job->id}/tmp-batch";
        $disk->makeDirectory($tempRelative);
        $tempDir = $disk->path($tempRelative);

        $outputZipRelative = "pdf-jobs/{$job->id}/output/batch-{$targetTool}.zip";
        $zip = new ZipArchive();
        $zip->open($disk->path($outputZipRelative), ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $files = $job->inputFiles;
        $total = max(1, $files->count());
        $succeeded = 0;

        foreach ($files as $index => $file) {
            $inputPath = $disk->path($file->stored_path);
            $baseName = pathinfo($file->original_name, PATHINFO_FILENAME);
            $outFilename = "{$targetTool}-{$baseName}.pdf";
            $outPath = "{$tempDir}/{$index}-{$outFilename}";

            try {
                $this->processOne($targetTool, $inputPath, $toolOptions, $outPath);
                $zip->addFile($outPath, $outFilename);
                $succeeded++;
            } catch (Throwable $e) {
                report($e);
            }

            $this->updateProgress($job, 10 + (int) (75 * ($index + 1) / $total));
        }

        $zip->close();
        $disk->deleteDirectory($tempRelative);

        if ($succeeded === 0) {
            throw new RuntimeException('None of the files could be processed.');
        }

        return [
            ['path' => $outputZipRelative, 'name' => "batch-{$targetTool}.zip", 'mime' => 'application/zip'],
        ];
    }

    /**
     * @param  array<string, mixed>  $options
     */
    private function processOne(string $tool, string $inputPath, array $options, string $outputPath): void
    {
        match ($tool) {
            'compress' => app(CompressService::class)->compress($inputPath, $outputPath),
            'rotate' => app(RotateService::class)->rotate(
                $inputPath,
                trim((string) ($options['pages'] ?? '')) ?: '1-z',
                (int) ($options['degrees'] ?? 90),
                $outputPath
            ),
            'watermark' => app(WatermarkService::class)->apply(
                $inputPath,
                trim((string) ($options['text'] ?? 'CONFIDENTIAL')),
                $outputPath
            ),
            'page-numbers' => app(PageNumberService::class)->apply($inputPath, $outputPath),
            'crop' => app(CropService::class)->crop(
                $inputPath,
                (float) ($options['top'] ?? 0),
                (float) ($options['right'] ?? 0),
                (float) ($options['bottom'] ?? 0),
                (float) ($options['left'] ?? 0),
                $outputPath
            ),
            'protect' => app(ProtectService::class)->protect(
                $inputPath,
                (string) ($options['password'] ?? ''),
                $outputPath
            ),
            'unlock' => app(UnlockService::class)->unlock(
                $inputPath,
                (string) ($options['password'] ?? ''),
                $outputPath
            ),
            default => throw new RuntimeException("Unsupported batch tool: {$tool}"),
        };
    }

    protected function friendlyError(): string
    {
        return 'Could not batch-process these files. Please make sure they are all valid, non-corrupted PDFs.';
    }
}
