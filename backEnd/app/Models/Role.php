<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $primaryKey = 'role_id';

    protected $keyType = 'string';

    protected $fillable = [
        'role_id',
        'role_title',
    ];

    public $incrementing = false;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the users assigned to this role.
     */
    public function users()
    {
        return $this->hasMany(RoleForUser::class, 'role_id', 'role_id');
    }
}
