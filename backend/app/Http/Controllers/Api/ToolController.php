<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\CompressPdfJob;
use App\Jobs\CropPdfJob;
use App\Jobs\ExtractPagesPdfJob;
use App\Jobs\ImageToPdfJob;
use App\Jobs\OcrPdfJob;
use App\Jobs\OfficeConvertJob;
use App\Jobs\OrganizePdfJob;
use App\Jobs\PageNumbersPdfJob;
use App\Jobs\ProtectPdfJob;
use App\Jobs\RemovePagesPdfJob;
use App\Jobs\RotatePdfJob;
use App\Jobs\SplitPdfJob;
use App\Jobs\UnlockPdfJob;
use App\Jobs\WatermarkPdfJob;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ToolController extends Controller
{
    /**
     * Registry of "simple" tools: one queued job, straightforward file validation.
     * Tools with bespoke upload handling (e.g. merge) keep their own controller.
     * A method (not a class const) because some entries dispatch via closure,
     * which PHP does not allow inside a constant expression.
     */
    private static function tools(): array
    {
        return [
        'split' => ['dispatch' => [SplitPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'remove-pages' => ['dispatch' => [RemovePagesPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'extract-pages' => ['dispatch' => [ExtractPagesPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'watermark' => ['dispatch' => [WatermarkPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'page-numbers' => ['dispatch' => [PageNumbersPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'jpg-to-pdf' => ['dispatch' => [ImageToPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 30, 'mimes' => 'jpg,jpeg,png', 'queue' => 'light'],
        'rotate' => ['dispatch' => [RotatePdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'protect' => ['dispatch' => [ProtectPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'unlock' => ['dispatch' => [UnlockPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'crop' => ['dispatch' => [CropPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],
        'organize' => ['dispatch' => [OrganizePdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'light'],

        // Heavier tools: Ghostscript / LibreOffice, routed to the 'heavy' queue.
        // Note: only Office->PDF directions are registered. PDF->Office (docx/pptx/xlsx
        // export) is disabled — this LibreOffice install's non-PDF export filters are
        // broken (import + PDF export both verified working; docx/pptx/xlsx export
        // fails with "no export filter found" regardless of profile/install state).
        'compress' => ['dispatch' => [CompressPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'heavy'],
        'word-to-pdf' => ['dispatch' => fn ($id) => OfficeConvertJob::dispatch($id, 'pdf', 'converted.pdf', 'application/pdf'), 'min_files' => 1, 'max_files' => 1, 'mimes' => 'doc,docx', 'queue' => 'heavy'],
        'ppt-to-pdf' => ['dispatch' => fn ($id) => OfficeConvertJob::dispatch($id, 'pdf', 'converted.pdf', 'application/pdf'), 'min_files' => 1, 'max_files' => 1, 'mimes' => 'ppt,pptx', 'queue' => 'heavy'],
        'excel-to-pdf' => ['dispatch' => fn ($id) => OfficeConvertJob::dispatch($id, 'pdf', 'converted.pdf', 'application/pdf'), 'min_files' => 1, 'max_files' => 1, 'mimes' => 'xls,xlsx', 'queue' => 'heavy'],
        'ocr' => ['dispatch' => [OcrPdfJob::class, 'dispatch'], 'min_files' => 1, 'max_files' => 1, 'mimes' => 'pdf', 'queue' => 'heavy'],
        ];
    }

    public function store(Request $request, string $tool): JsonResponse
    {
        $tools = self::tools();
        abort_unless(isset($tools[$tool]), 404, 'Unknown tool.');
        $config = $tools[$tool];

        $request->validate([
            'files' => ['required', 'array', "min:{$config['min_files']}", "max:{$config['max_files']}"],
            'files.*' => ['required', 'file', "mimes:{$config['mimes']}", 'max:51200'],
            'options' => ['sometimes', 'array'],
            'options.*' => ['nullable', 'string', 'max:8000'],
        ]);

        $job = PdfJob::create([
            'tool_type' => $tool,
            'status' => 'pending',
            'options' => $request->input('options', []),
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
            'expires_at' => now()->addHour(),
        ]);

        $disk = Storage::disk('local');
        $basePath = "pdf-jobs/{$job->id}/input";

        foreach ($request->file('files') as $index => $file) {
            $extension = $file->getClientOriginalExtension() ?: 'pdf';
            $storedPath = $file->storeAs($basePath, Str::uuid()->toString().'.'.$extension, 'local');

            $job->files()->create([
                'original_name' => $file->getClientOriginalName(),
                'stored_path' => $storedPath,
                'disk' => 'local',
                'mime_type' => $file->getClientMimeType(),
                'size_bytes' => $file->getSize(),
                'is_input' => true,
                'position' => $index,
                'expires_at' => $job->expires_at,
            ]);
        }

        $pendingDispatch = is_array($config['dispatch'])
            ? call_user_func($config['dispatch'], $job->id)
            : ($config['dispatch'])($job->id);

        $pendingDispatch->onQueue($config['queue']);

        return response()->json(['job_id' => $job->id], 202);
    }
}
