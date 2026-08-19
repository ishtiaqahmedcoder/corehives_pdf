<?php

namespace App\Jobs;

use App\Models\PdfJob;
use App\Services\Image\GdImage;
use App\Services\Image\PhotoEditorService;
use Illuminate\Contracts\Filesystem\Filesystem;
use RuntimeException;

class PhotoEditorJob extends BasePdfJob
{
    protected function process(PdfJob $job, Filesystem $disk): array
    {
        $inputFile = $job->inputFiles->first();
        $inputPath = $disk->path($inputFile->stored_path);

        $edits = json_decode((string) ($job->options['edits'] ?? '[]'), true);
        if (! is_array($edits) || empty($edits)) {
            throw new RuntimeException('No text was added to the image.');
        }

        $format = GdImage::formatOf($inputPath);
        $extension = $format === 'jpeg' ? 'jpg' : $format;
        $outputRelativePath = "pdf-jobs/{$job->id}/output/edited.{$extension}";

        app(PhotoEditorService::class)->apply($inputPath, $edits, $disk->path($outputRelativePath));

        return [
            ['path' => $outputRelativePath, 'name' => "edited.{$extension}", 'mime' => "image/{$format}"],
        ];
    }

    protected function friendlyError(): string
    {
        return 'Could not edit this image. Please make sure it is a valid JPG or PNG file.';
    }
}
