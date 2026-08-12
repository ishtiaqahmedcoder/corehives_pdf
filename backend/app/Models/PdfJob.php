<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PdfJob extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'tool_type',
        'status',
        'progress',
        'options',
        'output_files',
        'error_message',
        'ip_hash',
        'started_at',
        'completed_at',
        'expires_at',
    ];

    protected $casts = [
        'options' => 'array',
        'output_files' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function files(): HasMany
    {
        return $this->hasMany(UploadedFile::class);
    }

    public function inputFiles(): HasMany
    {
        return $this->files()->where('is_input', true)->orderBy('position');
    }

    public function outputFileRecords(): HasMany
    {
        return $this->files()->where('is_input', false);
    }
}
