<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TrainingModule extends Model
{
    protected $fillable = [
        'trainer_id',
        'title',
        'description',
        'content_url',
        'module_type',
        'order_index',
        'questions',
    ];

    protected $casts = [
        'questions' => 'array',
    ];

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }
}
