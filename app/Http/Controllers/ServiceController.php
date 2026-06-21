<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Public View Marketplace for End-Users
     */
    public function index()
    {
        return Inertia::render('Users/Services', [
            'services' => Service::where('is_active', true)->get()
        ]);
    }

    /**
     * Admin Panel Control Center Management Dashboard View
     */
    public function adminIndex()
    {
        return Inertia::render('Admin/AdminServices', [
            'services' => Service::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Write new service record row parameters into database storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_type' => 'required|string|in:one-time,monthly',
            'description' => 'nullable|string',
        ]);

        Service::create($validated);

        return redirect()->back()->with('success', 'Service catalog row published successfully.');
    }

    /**
     * Delete an individual standalone service from inventory catalog records
     */
    public function destroy($id)
    {
        Service::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Service deleted successfully.');
    }
}
