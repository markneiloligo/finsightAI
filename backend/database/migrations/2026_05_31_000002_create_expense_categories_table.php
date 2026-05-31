<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 120);
            $table->string('slug', 140);
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'slug']);
            $table->index(['is_default', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
