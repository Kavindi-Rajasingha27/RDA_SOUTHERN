<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleForUser extends Model
{
    use HasFactory;

    protected $table = 'role_for_users';

    protected $fillable = [
        'user_id',
        'role_id',
    ];

    /**
     * Get the user that owns the role assignment.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Get the role assigned to the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }
}
