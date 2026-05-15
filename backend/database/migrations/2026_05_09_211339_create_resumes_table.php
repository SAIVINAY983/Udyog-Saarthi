<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('linkedin')->nullable();
            $table->text('address')->nullable();
            $table->text('permanentAddress')->nullable();
            $table->text('summary')->nullable();
            $table->text('education')->nullable();
            $table->text('experience')->nullable();
            $table->text('projects')->nullable();
            $table->text('certifications')->nullable();
            $table->text('researchPapers')->nullable();
            $table->text('achievements')->nullable();
            $table->text('extracurriculars')->nullable();
            $table->text('hobbies')->nullable();
            $table->longText('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
