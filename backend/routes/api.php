<?php

use App\Http\Controllers\Api\Developer\ApiKeyController;
use App\Http\Controllers\Api\Developer\AuthController;
use App\Http\Controllers\Api\JobDownloadController;
use App\Http\Controllers\Api\JobStatusController;
use App\Http\Controllers\Api\MergeController;
use App\Http\Controllers\Api\SignController;
use App\Http\Controllers\Api\ToolController;
use Illuminate\Support\Facades\Route;

// Internal (anonymous, web-tool) routes — IP-throttled, no account needed.
Route::post('/tools/merge', [MergeController::class, 'store'])
    ->middleware('throttle:20,60');

Route::post('/tools/sign', [SignController::class, 'store'])
    ->middleware('throttle:20,60');

Route::post('/tools/{tool}', [ToolController::class, 'store'])
    ->whereIn('tool', [
        'split', 'remove-pages', 'extract-pages', 'watermark', 'page-numbers', 'jpg-to-pdf',
        'compress', 'rotate', 'protect', 'unlock', 'crop', 'organize', 'edit', 'batch',
        'word-to-pdf', 'ppt-to-pdf', 'excel-to-pdf', 'pdf-to-word', 'pdf-to-ppt', 'pdf-to-excel', 'ocr',
        'compress-image', 'resize-image', 'rotate-image', 'convert-to-jpg',
        'crop-image', 'convert-from-jpg', 'watermark-image', 'meme-generator', 'photo-editor',
    ])
    ->middleware('throttle:20,60');

Route::get('/jobs/{id}', [JobStatusController::class, 'show']);

Route::get('/jobs/{job}/files/{file}/download', [JobDownloadController::class, 'show'])
    ->name('jobs.download')
    ->middleware('signed');

// Developer dashboard auth (Sanctum personal access tokens for the SPA dashboard).
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/developer/keys', [ApiKeyController::class, 'index']);
    Route::post('/developer/keys', [ApiKeyController::class, 'store']);
    Route::patch('/developer/keys/{apiKey}', [ApiKeyController::class, 'update']);
    Route::delete('/developer/keys/{apiKey}', [ApiKeyController::class, 'destroy']);
});

// Public developer API (v1) — authenticated by a developer's own API key,
// metered against their plan's monthly quota. Same controllers/jobs as the
// internal routes above; only the auth/quota layer differs.
Route::prefix('v1')->group(function () {
    Route::post('/tools/merge', [MergeController::class, 'store'])->middleware('apikey');
    Route::post('/tools/sign', [SignController::class, 'store'])->middleware('apikey');
    Route::post('/tools/{tool}', [ToolController::class, 'store'])
        ->whereIn('tool', [
            'split', 'remove-pages', 'extract-pages', 'watermark', 'page-numbers', 'jpg-to-pdf',
            'compress', 'rotate', 'protect', 'unlock', 'crop', 'organize', 'edit', 'batch',
            'word-to-pdf', 'ppt-to-pdf', 'excel-to-pdf', 'pdf-to-word', 'pdf-to-ppt', 'pdf-to-excel', 'ocr',
            'compress-image', 'resize-image', 'rotate-image', 'convert-to-jpg',
            'crop-image', 'convert-from-jpg', 'watermark-image', 'meme-generator', 'photo-editor',
        ])
        ->middleware('apikey');

    Route::get('/jobs/{id}', [JobStatusController::class, 'show'])->middleware('apikey:read');
});
