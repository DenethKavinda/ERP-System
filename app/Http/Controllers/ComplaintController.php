<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\ComplaintReply;
use App\Models\ComplaintAttachment; // For multi-file tracking
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
        // Fetch current user's complaints ordered by latest with engineering replies and multi-attachments
        $myComplaints = Complaint::where('user_id', Auth::id())
            ->with(['replies', 'attachments']) // Eager load the relationships layout
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Complain', [
            'myComplaints' => $myComplaints
        ]);
    }

    /**
     * Store inbound complaint data properties securely along with multiple attachments
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|string|in:low,medium,high',
            'description' => 'required|string|min:10',
            'attachments' => 'nullable|array', // Validates submission structure as an array matrix
            'attachments.*' => 'file|mimes:jpeg,png,jpg,pdf,zip|max:20480', // Support files up to 20MB per item
        ]);

        // Create the core grievance log entry node
        $complaint = Complaint::create([
            'user_id'     => Auth::id(),
            'subject'     => $validated['subject'],
            'category'    => $validated['category'],
            'priority'    => $validated['priority'],
            'description' => $validated['description'],
            'status'      => 'open', // Default status upon submission
        ]);

        // MULTI-FILE ATTACHMENT CONTROLLER LOOP LAYER
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $originalName = $file->getClientOriginalName();
                    $path = $file->store('complaints', 'public');

                    ComplaintAttachment::create([
                        'complaint_id'  => $complaint->id,
                        'file_path'     => $path,
                        'original_name' => $originalName,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Complaint ticket with attachments issued to admin systems queue.');
    }

    /**
     * Render Administrative Control Panel Listing View
     */
    public function adminIndex()
    {
        // Eager load attachments so they render on the administrative dashboard[cite: 3]
        $complaints = Complaint::with(['user:id,name,email', 'replies', 'attachments'])
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
            'attachment' => 'nullable|file|max:20480',
            'status'     => 'required|string|in:open,in-progress,resolved',
        ]);

        $complaint = Complaint::findOrFail($id);

        $replyData = [
            'complaint_id' => $complaint->id,
            'message'      => $request->message,
            'link_url'     => $request->link_url,
        ];

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('complaint_attachments', 'public');

            $replyData['file_path'] = '/storage/' . $path;
            $replyData['file_name'] = $file->getClientOriginalName();
        }

        ComplaintReply::create($replyData);

        // Transition the complaint lifecycle status to the chosen selection state (e.g., resolved)
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
     * User-initiated Complaint Deletion Loop
     */
    public function userDestroy($id)
    {
        $complaint = Complaint::where('user_id', Auth::id())->with(['replies', 'attachments'])->findOrFail($id);

        foreach ($complaint->attachments as $attachment) {
            if ($attachment->file_path) {
                Storage::disk('public')->delete($attachment->file_path);
            }
        }
        foreach ($complaint->replies as $reply) {
            if ($reply->file_path) {
                $cleanPath = str_replace('/storage/', '', $reply->file_path);
                Storage::disk('public')->delete($cleanPath);
            }
        }

        $complaint->delete();
        return redirect()->back()->with('success', 'Complaint ticket removed permanently.');
    }

    /**
     * Remove complaint entry permanently from admin control registers
     */
    public function destroy($id)
    {
        $complaint = Complaint::with(['replies', 'attachments'])->findOrFail($id);

        foreach ($complaint->attachments as $attachment) {
            if ($attachment->file_path) {
                Storage::disk('public')->delete($attachment->file_path);
            }
        }
        foreach ($complaint->replies as $reply) {
            if ($reply->file_path) {
                $cleanPath = str_replace('/storage/', '', $reply->file_path);
                Storage::disk('public')->delete($cleanPath);
            }
        }

        $complaint->delete();
        return redirect()->back()->with('success', 'Complaint ticket removed successfully.');
    }

    /**
     * Securely downloads admin reply attachments across both User & Admin spaces
     */
    public function downloadReplyAttachment($replyId)
    {
        $reply = ComplaintReply::findOrFail($replyId);
        $complaint = $reply->complaint;

        if (Auth::id() !== $complaint->user_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized access request.');
        }

        if (!$reply->file_path) {
            abort(404, 'No file associated.');
        }

        $diskPath = str_replace('/storage/', '', $reply->file_path);

        if (!Storage::disk('public')->exists($diskPath)) {
            abort(404, 'File not found on disk.');
        }

        return response()->download(storage_path('app/public/' . $diskPath), $reply->file_name);
    }

    /**
     * Force download user uploaded documentation records
     */
    public function downloadUserAttachment($id)
    {
        $attachment = ComplaintAttachment::findOrFail($id);
        $complaint = $attachment->complaint;

        if (Auth::id() !== $complaint->user_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        if (!Storage::disk('public')->exists($attachment->file_path)) {
            abort(404, 'File not found.');
        }

        return response()->download(storage_path('app/public/' . $attachment->file_path), $attachment->original_name);
    }
}
