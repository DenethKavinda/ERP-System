<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'erp' => [
        'api_url' => env('ERP_API_URL', 'http://localhost:8000'),
        'app_url' => env('ERP_APP_URL', 'http://localhost:5173'),
        'provisioning_key' => env('ERP_PROVISIONING_KEY', ''),
    ],

    'payhere' => [
        'merchant_id' => env('PAYHERE_MERCHANT_ID', '1228224'),
        'secret'      => env('PAYHERE_SECRET', '4TVRczJkMjU0a8u6x8a1p1f'),
        'is_sandbox'  => env('PAYHERE_IS_SANDBOX', true),
    ],

];
