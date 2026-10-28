<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ErpCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;
    public string $loginEmail;
    public string $loginPassword;
    public string $erpUrl;
    public string $portalUrl;
    public string $planName;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $userName,
        string $loginEmail,
        string $loginPassword,
        string $erpUrl,
        string $planName,
        string $portalUrl = ''
    ) {
        $this->userName      = $userName;
        $this->loginEmail    = $loginEmail;
        $this->loginPassword = $loginPassword;
        $this->erpUrl        = $erpUrl;
        $this->planName      = $planName;
        $this->portalUrl     = $portalUrl ?: config('app.url', 'https://portal.codexpressitsolutions.com');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Nexus ERP — Your Login Credentials',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.erp-credentials',
        );
    }
}
