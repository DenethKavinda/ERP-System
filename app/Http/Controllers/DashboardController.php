<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DashboardCard;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // Render public customer/user dashboard using dynamic cards
    public function index()
    {
        return Inertia::render('Users/Dashboard', [
            'navigationCards' => DashboardCard::all()
        ]);
    }

    // Render configuration panel page
    public function adminIndex()
    {
        return Inertia::render('Admin/DashboardManager', [
            'cards' => DashboardCard::all()
        ]);
    }

    // Save a brand new card layout option to the database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'button_text' => 'required|string|max:255',
            'description' => 'required|string',
            'accent_color' => 'required|string',
        ]);

        DashboardCard::create($validated);

        return redirect()->back()->with('success', 'Card created successfully.');
    }

    // Delete an existing card from the system
    public function destroy($id)
    {
        DashboardCard::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Card deleted successfully.');
    }
}
