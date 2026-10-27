<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('customer_id')->unique()->nullable()->after('id');
        });

        // Generate customer IDs for all existing users
        $users = \App\Models\User::whereNull('customer_id')->get();
        foreach ($users as $user) {
            $user->customer_id = 'NXS-' . str_pad($user->id, 5, '0', STR_PAD_LEFT);
            $user->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('customer_id');
        });
    }
};
