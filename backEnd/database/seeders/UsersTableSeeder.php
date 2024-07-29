<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentTimestamp = Carbon::now();

        $users = [
            [
                'user_name' => 'chief_engineer',
                'role_id' => 'CE',
                'role_des' => 'Chief Engineer',
                'password' => Hash::make('ce@rda123'),
                'logging_attempts' => 0,
                'created_at' => $currentTimestamp,
                'updated_at' => $currentTimestamp,
            ],
            [
                'user_name' => 'accountant',
                'role_id' => 'ACC',
                'role_des' => 'Accountant',
                'password' => Hash::make('acc@rda123'),
                'logging_attempts' => 0,
                'created_at' => $currentTimestamp,
                'updated_at' => $currentTimestamp,
            ],
            [
                'user_name' => 'assistant_engineer',
                'role_id' => 'AE',
                'role_des' => 'Assistant Engineer',
                'password' => Hash::make('ae@rda123'),
                'logging_attempts' => 0,
                'created_at' => $currentTimestamp,
                'updated_at' => $currentTimestamp,
            ],
        ];

        DB::table('users')->insert($users);
    }
}
