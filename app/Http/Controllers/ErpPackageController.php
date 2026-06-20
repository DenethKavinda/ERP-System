<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ErpPackage;
use Inertia\Inertia;

class ErpPackageController extends Controller
{
    /**
     * Display the public storefront page for customers.
     */
    public function index()
    {
        $packages = ErpPackage::orderBy('price', 'asc')->get();

        return Inertia::render('Users/ERP', [
            'packages' => $packages
        ]);
    }

    /**
     * Display the administrative listing and form portal.
     */
    public function adminIndex()
    {
        $packages = ErpPackage::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/AdminPackages', [
            'packages' => $packages
        ]);
    }

    /**
     * Handle inbound form updates and store a newly created package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_for' => 'nullable|string',
            'features' => 'nullable|string',
            'benefits' => 'nullable|string',
            'rating' => 'nullable|string|max:5',
        ]);

        ErpPackage::create($validated);

        return redirect()->back()->with('success', 'ERP package published successfully.');
    }
}
