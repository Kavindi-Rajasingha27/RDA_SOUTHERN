<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstimatedRoutesTable extends Migration
{
    public function up()
    {
        Schema::create('estimated_routes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('start');
            $table->json('end');
            $table->float('distance');
            $table->float('time');
            $table->json('waypoints');
            $table->timestamps();
            
            // Create a generated column for spatial indexing
            $table->point('waypoints_geom', 4326)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estimated_routes');
    }
}
