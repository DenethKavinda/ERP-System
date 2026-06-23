<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DashboardCard;
use Inertia\Inertia;
use App\Models\PackageCart;
use App\Models\Package;

class DashboardController extends Controller
{
    // Render public customer/user dashboard using dynamic cards
    public function index()
    {
        return Inertia::render('Users/Dashboard', [
            'navigationCards' => DashboardCard::all(),
            // FIXED: Eager loads the added carts with all their attached child packages onto the user page
            'packageCarts' => PackageCart::with('packages')->get()
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

        return redirect()->back()->with('success', 'Card updated successfully.');
    }



    // ==========================================
    // NEW METHODS: ADMIN PACKAGES MANAGER PANEL
    // ==========================================

    public function adminPackagesIndex()
    {
        return Inertia::render('Admin/PackagesManager', [
            'carts' => PackageCart::with('packages')->get()
        ]);
    }

    public function storeCart(Request $request)
    {
        $validated = $request->validate([
            'cart_name' => 'required|string|max:255',
            'button_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color_class' => 'required|string',
        ]);

        PackageCart::create($validated);
        return redirect()->back()->with('success', 'Package Card created successfully.');
    }

    public function storePackage(Request $request)
    {
        $validated = $request->validate([
            'package_cart_id' => 'required|exists:package_carts,id',
            'youtube_link' => 'nullable|url',
            'main_topic' => 'required|string|max:255',
            'small_description' => 'required|string',
            'package_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_business' => 'required|string',
            'core_features' => 'required|string',
            'benefits' => 'required|string',
            'rating' => 'nullable|numeric|between:1,5',
        ]);

        Package::create($validated);
        return redirect()->back()->with('success', 'Package item appended successfully.');
    }

    public function destroyCart($id)
    {
        PackageCart::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Cart removed successfully.');
    }
}
