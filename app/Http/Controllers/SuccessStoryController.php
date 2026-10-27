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

        // Only fetch approved success stories for the public page
        $feedbacks = SuccessStory::with('user:id,name,business_name,customer_id')
            ->where('is_approved', true)
            ->latest()
            ->get();

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
        // Requires admin approval before appearing publicly
        $validated['is_approved'] = false;

        $request->user()->successStories()->create($validated);

        return redirect()->back()->with('success', 'Thank you! Your success story has been submitted for admin review. Once approved, it will appear publicly.');
    }

    /**
     * Admin Control Center panel to view submitted user testimonials.
     */
    public function adminIndex()
    {
        // Eager loads the complete review collection paired alongside customer identification
        $feedbacks = SuccessStory::with('user:id,name,email,business_name,customer_id')
            ->latest()
            ->get();

        return Inertia::render('Admin/AdminSuccessStories', [
            'feedbacks' => $feedbacks,
        ]);
    }

    /**
     * Admin approves a success story so it displays publicly.
     */
    public function approve($id)
    {
        $story = SuccessStory::findOrFail($id);
        $story->update(['is_approved' => true]);

        return redirect()->back()->with('success', "Success story for '{$story->item_name}' approved and published publicly.");
    }

    /**
     * Admin unapproves / hides a success story from public display.
     */
    public function unapprove($id)
    {
        $story = SuccessStory::findOrFail($id);
        $story->update(['is_approved' => false]);

        return redirect()->back()->with('success', "Success story for '{$story->item_name}' unapproved and hidden from public view.");
    }

    /**
     * Admin permanently deletes a rejected or unapproved success story.
     */
    public function destroy($id)
    {
        $story = SuccessStory::findOrFail($id);
        $story->delete();

        return redirect()->back()->with('success', 'Success story deleted successfully.');
    }
}
