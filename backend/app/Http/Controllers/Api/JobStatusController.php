<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;

class JobStatusController extends Controller
{
    public function show(string $id): JsonResponse
    {
        $job = PdfJob::with('files')->findOrFail($id);

        $downloadUrl = null;

        if ($job->status === 'completed') {
            $output = $job->outputFileRecords()->first();

            if ($output) {
                $downloadUrl = URL::temporarySignedRoute(
                    'jobs.download',
                    now()->addMinutes(30),
                    ['job' => $job->id, 'file' => $output->id]
                );
            }
        }

        return response()->json([
            'id' => $job->id,
            'tool_type' => $job->tool_type,
            'status' => $job->status,
            'progress' => $job->progress,
            'error_message' => $job->error_message,
            'download_url' => $downloadUrl,
            'expires_at' => $job->expires_at,
        ]);
    }
}
