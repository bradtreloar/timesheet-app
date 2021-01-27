<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbsencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'absences', function (Blueprint $table) {
                $table->id();
                $table->date('date');
                $table->enum(
                    'reason', [
                        "absent:sick-day",
                        "absent:not-sick-day",
                        "annual-leave",
                        "long-service",
                        "unpaid-leave",
                        "public-holiday",
                        "rostered-day-off",
                    ]
                );
                $table->bigInteger('timesheet_id');
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('absences');
    }
}
