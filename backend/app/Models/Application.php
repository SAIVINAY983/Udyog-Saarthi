<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_posting_id',
        'user_id',
        'status',
        'resume_type',
        'resume_path',
        'notes',
        'interview_score',
        'interview_time',
        'meeting_link',
        'assessment_score',
        'assessment_status',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
