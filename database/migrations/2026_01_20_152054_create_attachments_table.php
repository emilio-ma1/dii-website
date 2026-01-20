<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('noticias_id')->constrained('noticias')->cascadeOnDelete();

            $table->string('file_name', 255);
            $table->string('file_url', 500);

            $table->string('mime_type', 120)->nullable();
            $table->unsignedBigInteger('file_size_bytes')->nullable();

            $table->timestampTz('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};