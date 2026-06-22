<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\ComplaintReply;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    /**
     * Show form page and personal submission history for the user
     */
    public function create()
    {
        // Fetch current user's complaints ordered by latest with their engineering replies
        $myComplaints = Complaint::where('user_id', Auth::id())
            ->with('replies')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Complain', [
            'myComplaints' => $myComplaints
        ]);
    }

    /**
     * Store inbound complaint data properties securely
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|string|in:low,medium,high',
            'description' => 'required|string|min:10',
        ]);

        Complaint::create([
            'user_id'     => Auth::id(),
            'subject'     => $validated['subject'],
            'category'    => $validated['category'],
            'priority'    => $validated['priority'],
            'description' => $validated['description'],
            'status'      => 'open', // Default status upon submission
        ]);

        return redirect()->back()->with('success', 'Complaint ticket issued to admin systems queue.');
    }

    /**
     * Render Administrative Control Panel Listing View
     */
    public function adminIndex()
    {
        // Fetch all complaints with their creator's details and active replies
        $complaints = Complaint::with(['user:id,name,email', 'replies'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/AdminComplaints', [
            'complaints' => $complaints
        ]);
    }

    /**
     * Store admin reply with message, link, or document attachments
     */
    public function storeReply(Request $request, $id)
    {
        $request->validate([
            'message'    => 'nullable|string',
            'link_url'   => 'nullable|url',
            'attachment' => 'nullable|file|max:20480', // Max file size capacity limit: 20MB
            'status'     => 'required|string|in:open,in-progress,resolved',
        ]);

        $complaint = Complaint::findOrFail($id);

        $replyData = [
            'complaint_id' => $complaint->id,
            'message'      => $request->message,
            'link_url'     => $request->link_url,
        ];

        // Process file upload securely if present
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            // Stores the file inside storage/app/public/complaint_attachments
            $path = $file->store('complaint_attachments', 'public');

            $replyData['file_path'] = '/storage/' . $path;
            $replyData['file_name'] = $file->getClientOriginalName();
        }

        // Save reply payload properties to database
        ComplaintReply::create($replyData);

        // Transition the complaint lifecycle status to the chosen selection state
        $complaint->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Reply dispatched and status updated successfully.');
    }

    /**
     * Update the tracking status loop lifecycle phase directly
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,in-progress,resolved',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Ticket status updated.');
    }

    /**
     * Remove complaint entry permanently from log records
     */
    public function destroy($id)
    {
        $complaint = Complaint::findOrFail($id);

        // Optional: Clean up associated reply attachment files from local disk storage on delete
        foreach ($complaint->replies as $reply) {
            if ($reply->file_path) {
                // Strips out public storage path naming context prefix matching
                $cleanPath = str_replace('/storage/', '', $reply->file_path);
                Storage::disk('public')->delete($cleanPath);
            }
        }

        $complaint->delete();

        return redirect()->back()->with('success', 'Complaint ticket removed successfully.');
    }

    /**
     * Force download a reply attachment file securely
     */
    public function downloadAttachment($replyId)
    {
        $reply = ComplaintReply::findOrFail($replyId);

        if (!$reply->file_path) {
            abort(404, 'No file associated with this reply.');
        }

        // Convert web path '/storage/complaint_attachments/xyz.pdf' to internal disk path
        $diskPath = str_replace('/storage/', '', $reply->file_path);

        if (!Storage::disk('public')->exists($diskPath)) {
            abort(404, 'File not found on server storage disk.');
        }

        // Highlight-select: Use the global response helper to stream from the public path storage directory path directly
        // This stops Intelephense from showing a false error.
        $fullPath = storage_path('app/public/' . $diskPath);

        return response()->download($fullPath, $reply->file_name);
    }
}
