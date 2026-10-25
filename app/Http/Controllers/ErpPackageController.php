<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ErpPackage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ErpPackageController extends Controller
{
    /**
     * Display the public storefront page for customers.
     */
    public function index()
    {
        $packages = ErpPackage::where(function ($q) {
            $q->where('status', 'active')->orWhereNull('status');
        })
        ->orderBy('sort_order', 'asc')
        ->orderBy('price', 'asc')
        ->get();

        return Inertia::render('Users/ERP', [
            'packages' => $packages
        ]);
    }

    /**
     * Display the administrative listing and form portal.
     */
    public function adminIndex()
    {
        $packages = ErpPackage::orderBy('sort_order', 'asc')
            ->orderBy('price', 'asc')
            ->get();

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
            'code' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'suitable_for' => 'nullable|string',
            'features' => 'nullable|string',
            'benefits' => 'nullable|string',
            'rating' => 'nullable|string|max:5',
            'youtube_id' => 'nullable|string|max:255',
            'max_branches' => 'required|integer',
            'max_warehouses' => 'required|integer',
            'max_users' => 'required|integer',
            'max_products' => 'required|integer',
            'max_monthly_bills' => 'required|integer',
            'is_popular' => 'nullable|boolean',
            'trial_days' => 'nullable|integer|min:0',
            'inherited_from' => 'nullable|string|max:100',
            'badge_text' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:active,draft,archived',
            'modules' => 'nullable|array',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = Str::slug($validated['name']);
        }
        $validated['is_popular'] = $request->boolean('is_popular');
        $validated['trial_days'] = (int) ($validated['trial_days'] ?? 0);
        $validated['status'] = $validated['status'] ?? 'active';
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        ErpPackage::create($validated);

        return redirect()->back()->with('success', 'ERP package published successfully.');
    }

    /**
     * Update an existing ERP package record row parameters in database storage
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'suitable_for' => 'nullable|string',
            'features' => 'nullable|string',
            'benefits' => 'nullable|string',
            'rating' => 'nullable|string|max:5',
            'youtube_id' => 'nullable|string|max:255',
            'max_branches' => 'required|integer',
            'max_warehouses' => 'required|integer',
            'max_users' => 'required|integer',
            'max_products' => 'required|integer',
            'max_monthly_bills' => 'required|integer',
            'is_popular' => 'nullable|boolean',
            'trial_days' => 'nullable|integer|min:0',
            'inherited_from' => 'nullable|string|max:100',
            'badge_text' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:active,draft,archived',
            'modules' => 'nullable|array',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = Str::slug($validated['name']);
        }
        $validated['is_popular'] = $request->boolean('is_popular');
        $validated['trial_days'] = (int) ($validated['trial_days'] ?? 0);
        if (isset($validated['status'])) {
            $validated['status'] = $validated['status'];
        }
        if (isset($validated['sort_order'])) {
            $validated['sort_order'] = (int) $validated['sort_order'];
        }

        $package = ErpPackage::findOrFail($id);
        $package->update($validated);

        return redirect()->back()->with('success', 'ERP package updated successfully.');
    }

    /**
     * Complete removal of an individual package from inventory store logs
     */
    public function destroy($id)
    {
        ErpPackage::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'ERP package dropped successfully.');
    }
}
