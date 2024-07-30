<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $primaryKey = 'employee_number';

    protected $fillable = [
        'name',
        'age',
        'address',
        'birthday',
        'designation',
        'corporate_title',
        'join_date',
        'etf_number',
        'contact_details'
    ];

    public function dependents()
    {
        return $this->hasMany(Dependent::class, 'employee_id', 'employee_number');
    }

    public function qualifications()
    {
        return $this->hasMany(Qualification::class, 'employee_id', 'employee_number');
    }
}
