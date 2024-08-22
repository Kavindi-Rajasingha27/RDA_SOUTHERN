<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Estimate extends Model
{
    protected $fillable = [
        'name',
        'start',
        'end',
        'distance',
        'time',
        'estimate',
        'type',
        'rate',
        'waypoints',
        'waypoints_geom',
        'status',
        'document_path',
    ];

    protected $casts = [
        'start' => 'array',
        'end' => 'array',
        'waypoints' => 'array',
    ];

    protected static function booted()
    {
        static::saving(function ($model) {
            $waypoints = collect($model->waypoints)->map(fn($point) => [$point['lng'], $point['lat']]);
            $model->waypoints_geom = DB::raw("ST_GeomFromText('POINT(" . implode(' ', $waypoints->first()) . ")', 4326)");
        });
    }
}
