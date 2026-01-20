<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('news_tags', function (Blueprint $table) {
            $table->foreignId('noticias_id')->constrained('noticias')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();

            $table->timestampTz('created_at')->useCurrent();

            $table->unique(['noticias_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_tags');
    }
};