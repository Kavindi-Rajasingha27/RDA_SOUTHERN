<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EstimatedRoute extends Model
{
    protected $fillable = [
        'name', 'start', 'end', 'distance', 'time', 'waypoints', 'waypoints_geom',
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
