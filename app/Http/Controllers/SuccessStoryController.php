<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ErpPackage;
use App\Models\SuccessStory;
use Inertia\Inertia;

class SuccessStoryController extends Controller
{
    public function index()
    {
        // Pluck active ERP package names
        $packages = ErpPackage::where('status', 'active')->pluck('name')->toArray();
        if (empty($packages)) {
            $packages = ErpPackage::pluck('name')->toArray();
        }

        // Fetch existing stories with user names
        $feedbacks = SuccessStory::with('user:id,name,business_name')->latest()->get();

        return Inertia::render('Users/SuccessStories', [
            'packages'  => $packages,
            'feedbacks' => $feedbacks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'feedback'  => 'required|string|min:10',
            'rating'    => 'required|integer|min:1|max:5',
        ]);

        $validated['item_type'] = 'package';

        $request->user()->successStories()->create($validated);

        return redirect()->back()->with('success', 'Thank you for sharing your ERP success story!');
    }

    /**
     * Admin Control Center panel to view submitted user testimonials.
     */
    public function adminIndex()
    {
        // Eager loads the complete review collection paired alongside individual user identity lines
        $feedbacks = SuccessStory::with('user:id,name,email,business_name')->latest()->get();

        return Inertia::render('Admin/AdminSuccessStories', [
            'feedbacks' => $feedbacks,
        ]);
    }
}
