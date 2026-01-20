<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('noticias', function (Blueprint $table) {
            $table->id();

            $table->string('titulo', 200);
            $table->string('slug', 220)->unique(); //-> es un nombre corto y descriptivo que se le da a una noticia o artículo para identificarlo y seguirlo durante el proceso de producción

            $table->string('resumen', 500)->nullable();
            $table->text('cuerpo');

            $table->string('cover_image_url', 500)->nullable();

            $table->string('status', 20)->default('draft'); // draft|published|archived
            $table->timestampTz('published_at')->nullable();

            $table->timestampsTz(); // created_at / updated_at con timezone
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticias');
    }
};