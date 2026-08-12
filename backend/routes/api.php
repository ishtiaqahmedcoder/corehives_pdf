<?php

use App\Http\Controllers\Api\JobDownloadController;
use App\Http\Controllers\Api\JobStatusController;
use App\Http\Controllers\Api\MergeController;
use Illuminate\Support\Facades\Route;

Route::post('/tools/merge', [MergeController::class, 'store'])
    ->middleware('throttle:20,60');

Route::get('/jobs/{id}', [JobStatusController::class, 'show']);

Route::get('/jobs/{job}/files/{file}/download', [JobDownloadController::class, 'show'])
    ->name('jobs.download')
    ->middleware('signed');
