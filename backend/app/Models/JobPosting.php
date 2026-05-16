<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'location',
        'latitude',
        'longitude',
        'job_type',
        'reservation_category',
        'skills_required',
        'is_verified',
    ];
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
