<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('news_categories', function (Blueprint $table) {
            $table->foreignId('noticias_id')->constrained('noticias')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();

            $table->timestampTz('created_at')->useCurrent();

            $table->unique(['noticias_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_categories');
    }
};