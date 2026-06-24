<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment; // References your payments table model
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LedgerController extends Controller
{
    /**
     * Display a comprehensive matrix of payment logs to serve as a user's transaction history.
     */
    public function index()
    {
        // Pulls full history (completed and failed attempts included for bookkeeping accuracy)
        $transactions = Payment::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Ledger', [
            'transactions' => $transactions
        ]);
    }
}
