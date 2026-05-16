<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'disability_type',
        'skills',
        'training_status',
        'readiness_score',
        'mock_interview_score',
    ];
}
