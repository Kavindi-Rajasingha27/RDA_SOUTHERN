<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('employee_number')->unique();
            $table->string('name');
            $table->integer('age');
            $table->string('address');
            $table->date('birthday');
            $table->string('designation');
            $table->string('corporate_title');
            $table->date('join_date');
            $table->string('etf_number');
            $table->string('contact_details');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}
