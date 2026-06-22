<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeDoc;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KnowledgeCenter extends Controller
{
    /**
     * User-facing listing view panel
     */
    public function viewKnowledgeCenter()
    {
        return Inertia::render('Users/KnowledgeCenter', [
            'documentation' => KnowledgeDoc::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Admin backend editor interface listing
     */
    public function adminIndex()
    {
        return Inertia::render('Admin/KnowledgeManager', [
            'documents' => KnowledgeDoc::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Store dynamic multimedia properties
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|string',
            'type'        => 'required|string|in:pdf,text,image,link,youtube',
            'description' => 'nullable|string',
            'web_url'     => 'nullable|required_if:type,link,youtube|string',
            'file_upload' => 'nullable|required_if:type,pdf,text,image|file|max:25600', // 25MB Max
        ]);

        $fileUrl = $this->handleAssetUrl($request);

        KnowledgeDoc::create([
            'title'       => $request->title,
            'category'    => $request->category,
            'type'        => $request->type,
            'description' => $request->description,
            'file_url'    => $fileUrl
        ]);

        return redirect()->back()->with('success', 'Asset published successfully.');
    }

    /**
     * Update an existing Knowledge base asset configuration
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|string',
            'type'        => 'required|string|in:pdf,text,image,link,youtube',
            'description' => 'nullable|string',
            'web_url'     => 'nullable|required_if:type,link,youtube|string',
            'file_upload' => 'nullable|file|max:25600',
        ]);

        $doc = KnowledgeDoc::findOrFail($id);

        // Retain original address unless a replacement file/URL is declared
        $fileUrl = $doc->file_url;

        if ($request->hasFile('file_upload') || $request->filled('web_url')) {
            // Clean up old files from storage prior to overwriting
            if (in_array($doc->type, ['pdf', 'text', 'image']) && $doc->file_url) {
                $oldCleanPath = str_replace('/storage/', '', $doc->file_url);
                Storage::disk('public')->delete($oldCleanPath);
            }
            $fileUrl = $this->handleAssetUrl($request);
        }

        $doc->update([
            'title'       => $request->title,
            'category'    => $request->category,
            'type'        => $request->type,
            'description' => $request->description,
            'file_url'    => $fileUrl,
            'slug'        => Str::slug($request->title) . '-' . rand(100, 999) // update reference slug
        ]);

        return redirect()->back()->with('success', 'Asset node modified successfully.');
    }

    /**
     * Shared extraction helper method parsing files or remote URLs
     */
    private function handleAssetUrl(Request $request)
    {
        if (in_array($request->type, ['pdf', 'text', 'image'])) {
            if ($request->hasFile('file_upload')) {
                $file = $request->file('file_upload');
                $path = $file->store('knowledge_vault', 'public');
                return '/storage/' . $path;
            }
        } elseif ($request->type === 'youtube') {
            $url = $request->web_url;
            preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $url, $match);
            return $match[1] ?? $url;
        }
        return $request->web_url ?? '';
    }

    /**
     * Force secure attachment downloads by bypassing standard browser previews
     */
    public function download($id)
    {
        $doc = KnowledgeDoc::findOrFail($id);

        if (!in_array($doc->type, ['pdf', 'text', 'image']) || !$doc->file_url) {
            abort(400, 'This node asset format type does not support storage file streaming streams.');
        }

        $diskPath = str_replace('/storage/', '', $doc->file_url);

        if (!Storage::disk('public')->exists($diskPath)) {
            abort(404, 'Asset target resource is missing from disk storage paths.');
        }

        $fullPath = storage_path('app/public/' . $diskPath);
        $downloadName = Str::slug($doc->title) . '.' . pathinfo($fullPath, PATHINFO_EXTENSION);

        return response()->download($fullPath, $downloadName);
    }

    /**
     * Wipe specific asset item track from system data logs
     */
    public function destroy($id)
    {
        $doc = KnowledgeDoc::findOrFail($id);

        if (in_array($doc->type, ['pdf', 'text', 'image']) && $doc->file_url) {
            $cleanPath = str_replace('/storage/', '', $doc->file_url);
            Storage::disk('public')->delete($cleanPath);
        }

        $doc->delete();
        return redirect()->back()->with('success', 'Document asset discarded cleanly.');
    }
}
