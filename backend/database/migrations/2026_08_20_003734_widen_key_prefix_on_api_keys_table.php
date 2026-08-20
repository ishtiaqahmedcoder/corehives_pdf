<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * key_prefix stores substr($rawKey, 0, 16) but the column was created as
     * varchar(12), so every key creation failed with a MySQL truncation error.
     * Widen it with headroom for a longer prefix in the future.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE api_keys MODIFY key_prefix VARCHAR(20) NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE api_keys MODIFY key_prefix VARCHAR(12) NOT NULL');
    }
};
