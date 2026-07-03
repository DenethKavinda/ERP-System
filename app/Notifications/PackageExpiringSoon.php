<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PackageExpiringSoon extends Notification
{
    use Queueable;

    protected $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Action Required: Your Plan Expires in 5 Days!')
            ->greeting("Hello {$notifiable->name},")
            ->line("This is a reminder that your access to the **{$this->payment->package_name}** package will expire in 5 days on **" . $this->payment->expires_at->format('F d, Y') . "**.")
            ->line('To ensure uninterrupted operations, please renew your access below.')
            ->action('Renew Package Now', url('/dashboard'))
            ->line('Thank you for using our platform!');
    }
}
