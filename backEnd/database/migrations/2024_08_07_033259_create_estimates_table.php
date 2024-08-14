<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstimatesTable extends Migration
{
    public function up()
    {
        Schema::create('estimates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('start');
            $table->json('end');
            $table->float('distance');
            $table->float('time');
            $table->float('estimate');
            $table->string('type')->nullable();
            $table->float('rate')->nullable();
            $table->json('waypoints');
            $table->timestamps();

            // Create a generated column for spatial indexing
            $table->point('waypoints_geom', 4326)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estimates');
    }
}
