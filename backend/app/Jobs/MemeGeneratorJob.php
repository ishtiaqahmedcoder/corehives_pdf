<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\MemeService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;

class MemeGeneratorJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $topText = trim((string) ($job->options['top_text'] ?? ''));
        $bottomText = trim((string) ($job->options['bottom_text'] ?? ''));

        if ($topText === '' && $bottomText === '') {
            throw new RuntimeException('Add a top or bottom caption.');
        }

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/meme.{$extension}";

        app(MemeService::class)->generate($inputPath, $disk->path($outputRelativePath), $topText, $bottomText);

        return [
            ['path' => $outputRelativePath, 'name' => "meme.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not create this meme. Please make sure the image is a valid JPG or PNG file.';
    }
}
