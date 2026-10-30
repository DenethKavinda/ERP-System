<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure-based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Automatically run the expiring package notification routine 
 * every single day at midnight.
 */
Schedule::command('packages:notify-expiring')->daily();

/**
 * Automatically reconcile ERP subscription states hourly.
 */
Schedule::command('erp:reconcile-subscriptions')->hourly();
