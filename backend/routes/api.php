<?php

use App\Http\Controllers\Api\JobDownloadController;
use App\Http\Controllers\Api\JobStatusController;
use App\Http\Controllers\Api\MergeController;
use App\Http\Controllers\Api\SignController;
use App\Http\Controllers\Api\ToolController;
use Illuminate\Support\Facades\Route;

Route::post('/tools/merge', [MergeController::class, 'store'])
    ->middleware('throttle:20,60');

Route::post('/tools/sign', [SignController::class, 'store'])
    ->middleware('throttle:20,60');

Route::post('/tools/{tool}', [ToolController::class, 'store'])
    ->whereIn('tool', [
        'split', 'remove-pages', 'extract-pages', 'watermark', 'page-numbers', 'jpg-to-pdf',
        'compress', 'rotate', 'protect', 'unlock', 'crop', 'organize',
        'word-to-pdf', 'ppt-to-pdf', 'excel-to-pdf', 'ocr',
    ])
    ->middleware('throttle:20,60');

Route::get('/jobs/{id}', [JobStatusController::class, 'show']);

Route::get('/jobs/{job}/files/{file}/download', [JobDownloadController::class, 'show'])
    ->name('jobs.download')
    ->middleware('signed');
