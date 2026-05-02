<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingModule extends Model
{
    protected $fillable = [
        'trainer_id',
        'title',
        'description',
        'content_url',
        'module_type',
        'order_index',
    ];
}
