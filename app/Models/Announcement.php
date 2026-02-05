<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'event_date',
        'event_time_start',
        'event_time_end',
        'location',
        'status',
        'published_at',
        'expired_at',
    ];

    protected static function booted()
    {
        static::creating(function ($announcement) {
            if (empty($announcement->slug)) {
                $announcement->slug = Str::slug($announcement->title);
            }
        });
    }
}
