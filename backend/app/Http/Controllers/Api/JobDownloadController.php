<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PdfJob;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JobDownloadController extends Controller
{
    public function show(PdfJob $job, UploadedFile $file): StreamedResponse
    {
        abort_unless($file->pdf_job_id === $job->id && ! $file->is_input, 404);
        abort_if($job->expires_at && $job->expires_at->isPast(), 410, 'This file has expired.');

        return Storage::disk($file->disk)->download($file->stored_path, $file->original_name);
    }
}
