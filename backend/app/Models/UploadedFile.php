<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadedFile extends Model
{
    protected $fillable = [
        'pdf_job_id',
        'original_name',
        'stored_path',
        'disk',
        'mime_type',
        'size_bytes',
        'is_input',
        'position',
        'expires_at',
    ];

    protected $casts = [
        'is_input' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function pdfJob(): BelongsTo
    {
        return $this->belongsTo(PdfJob::class);
    }
}
