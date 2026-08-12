<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pdf_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tool_type');
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->unsignedTinyInteger('progress')->default(0);
            $table->json('options')->nullable();
            $table->json('output_files')->nullable();
            $table->text('error_message')->nullable();
            $table->string('ip_hash')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'expires_at']);
            $table->index(['ip_hash', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pdf_jobs');
    }
};
