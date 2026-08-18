<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pdf_jobs', function (Blueprint $table) {
            $table->foreignId('api_key_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pdf_jobs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('api_key_id');
        });
    }
};
