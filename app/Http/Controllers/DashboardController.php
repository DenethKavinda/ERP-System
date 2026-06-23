<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DashboardCard;
use Inertia\Inertia;
use App\Models\PackageCart;
use App\Models\Package;

class DashboardController extends Controller
{
    /**
     * Render public customer/user workspace dashboard node.
     * Eager loads all package carts alongside their nested sub-packages.
     */
    public function index()
    {
        return Inertia::render('Users/Dashboard', [
            'navigationCards' => DashboardCard::all(),
            'packageCarts' => PackageCart::with('packages')->get()
        ]);
    }

    /**
     * Render the administrative configuration management portal page
     * for the Central Operations Framework system nodes.
     */
    public function adminIndex()
    {
        return Inertia::render('Admin/DashboardManager', [
            'cards' => DashboardCard::all()
        ]);
    }

    /**
     * Save a brand new Central Operations Framework card layout option to the database.
     */
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

        return redirect()->back()->with('success', 'Framework Card created successfully.');
    }

    /**
     * Update an existing Central Operations Framework card node within the system.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'button_text' => 'required|string|max:255',
            'description' => 'required|string',
            'accent_color' => 'required|string',
        ]);

        $card = DashboardCard::findOrFail($id);
        $card->update($validated);

        return redirect()->back()->with('success', 'Framework Card updated successfully.');
    }

    /**
     * Delete an existing Central Operations Framework card from the system database.
     */
    public function destroy($id)
    {
        DashboardCard::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Framework Card deleted successfully.');
    }

    // =========================================================================
    // ADMINISTRATIVE ARCHITECTURE LAYER: PACKAGES & CARTS CRUDS
    // =========================================================================

    /**
     * Render the main administration package feed manager configuration view workspace.
     */
    public function adminPackagesIndex()
    {
        return Inertia::render('Admin/PackagesManager', [
            'carts' => PackageCart::with('packages')->get()
        ]);
    }

    /**
     * Register a new package container group (Cart component) into database logs.
     */
    public function storeCart(Request $request)
    {
        $validated = $request->validate([
            'cart_name' => 'required|string|max:255',
            'button_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color_class' => 'required|string',
            'youtube_link' => 'nullable|url', // Shifted here
        ]);

        PackageCart::create($validated);
        return redirect()->back()->with('success', 'Package Group Cart registered successfully.');
    }

    public function updateCart(Request $request, $id)
    {
        $validated = $request->validate([
            'cart_name' => 'required|string|max:255',
            'button_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color_class' => 'required|string',
            'youtube_link' => 'nullable|url', // Shifted here
        ]);

        $cart = PackageCart::findOrFail($id);
        $cart->update($validated);

        return redirect()->back()->with('success', 'Package Group Cart parameters updated.');
    }

    /**
     * Remove an entire target package cart layout node from the ecosystem database.
     * Note: Cascading foreign relations automatically purge attached individual variants.
     */
    public function destroyCart($id)
    {
        PackageCart::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Package Group Cart removed successfully from ecosystem.');
    }

    /**
     * Deploy a new individual feature variant system package allocated under a parent container.
     */
    public function storePackage(Request $request)
    {
        $validated = $request->validate([
            'package_cart_id' => 'required|exists:package_carts,id',
            'main_topic' => 'required|string|max:255',
            'small_description' => 'required|string',
            'package_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_business' => 'required|string',
            'core_features' => 'required|string',
            'benefits' => 'required|string',
            'rating' => 'nullable|numeric|between:1,5',
            'discount_percentage' => 'nullable|numeric|between:0,100',
            'discount_description' => 'nullable|string|max:255',
        ]);

        Package::create($validated);
        return redirect()->back()->with('success', 'Package node registered successfully.');
    }

    public function updatePackage(Request $request, $id)
    {
        $validated = $request->validate([
            'package_cart_id' => 'required|exists:package_carts,id',
            'main_topic' => 'required|string|max:255',
            'small_description' => 'required|string',
            'package_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_business' => 'required|string',
            'core_features' => 'required|string',
            'benefits' => 'required|string',
            'rating' => 'nullable|numeric|between:1,5',
            'discount_percentage' => 'nullable|numeric|between:0,100',
            'discount_description' => 'nullable|string|max:255',
        ]);

        $package = Package::findOrFail($id);
        $package->update($validated);

        return redirect()->back()->with('success', 'Package configuration updated successfully.');
    }

    /**
     * Delete an individual sub-package entry from matching cart relation logs.
     */
    public function destroyPackage($id)
    {
        Package::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Package item removed successfully from group allocation table.');
    }
}
