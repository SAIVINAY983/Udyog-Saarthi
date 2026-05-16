<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserProgress extends Model
{
    protected $fillable = [
        'user_id',
        'training_module_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trainingModule()
    {
        return $this->belongsTo(TrainingModule::class);
    }
}
