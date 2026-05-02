<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\JobPosting;
use App\Models\TrainingModule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $employer = User::create([
            'name' => 'NIEPMD Admin',
            'email' => 'admin@niepmd.gov.in',
            'password' => Hash::make('password'),
            'role' => 'employer',
        ]);

        $user = User::create([
            'name' => 'Rahul (User)',
            'email' => 'rahul@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
        $user->profile()->create([
            'disability_type' => 'Locomotor Disability',
            'skills' => 'Typing, Basic English',
            'training_status' => 'in_progress',
            'readiness_score' => 65,
        ]);

        $trainer = User::create([
            'name' => 'Dr. Smith (Trainer)',
            'email' => 'trainer@example.com',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);
        $trainer->profile()->create(['training_status' => 'completed']);

        JobPosting::create([
            'employer_id' => $employer->id,
            'title' => 'Data Entry Operator',
            'description' => 'Looking for a skilled data entry operator. Flexible timings and work from home options available.',
            'location' => 'Chennai, Tamil Nadu',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'job_type' => 'Full-time',
            'reservation_category' => '4% PwD Reservation',
            'skills_required' => 'Typing, MS Office',
            'is_verified' => true,
        ]);

        JobPosting::create([
            'employer_id' => $employer->id,
            'title' => 'Customer Support Executive',
            'description' => 'Support executive needed for voice and non-voice processes. Wheelchair accessible office with specialized software.',
            'location' => 'Bangalore, Karnataka',
            'latitude' => 12.9716,
            'longitude' => 77.5946,
            'job_type' => 'Part-time',
            'reservation_category' => '4% PwD Reservation',
            'skills_required' => 'Communication, Patience',
            'is_verified' => true,
        ]);

        TrainingModule::create([
            'trainer_id' => $trainer->id,
            'title' => 'Interview Preparation Mastery',
            'description' => 'A complete guide to passing job interviews with confidence. Includes mock interview scenarios.',
            'content_url' => 'https://example.com/video1.mp4',
            'module_type' => 'video',
            'order_index' => 1,
        ]);

        TrainingModule::create([
            'trainer_id' => $trainer->id,
            'title' => 'Basic Computer Skills',
            'description' => 'Learn the fundamentals of operating a computer, using the internet, and MS Office.',
            'content_url' => 'https://example.com/pdf1.pdf',
            'module_type' => 'pdf',
            'order_index' => 2,
        ]);
    }
}
