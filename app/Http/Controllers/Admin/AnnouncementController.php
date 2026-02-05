<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $announcements = Announcement::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%"); // Opsional: cari di konten juga
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/announcements/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required'],
            'event_date' => ['nullable', 'date'],
            'event_time_start' => ['nullable'],
            'event_time_end' => ['nullable'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        Announcement::create($data);

        return to_route('admin.announcements.index');
    }

    /**
     * Menampilkan halaman edit.
     */
    public function edit(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Menyimpan perubahan data (Update).
     */
    public function update(Request $request, Announcement $announcement)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required'],
            'event_date' => ['nullable', 'date'],
            'event_time_start' => ['nullable'],
            'event_time_end' => ['nullable'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        // Logic: Jika status berubah jadi published dan belum punya tanggal publish, set ke now()
        // Jika status jadi draft/archived, kita biarkan published_at tetap ada (sebagai histori) atau bisa diset null tergantung kebutuhan.
        // Di sini saya biarkan logic sederhana: set tanggal jika baru dipublish.
        if ($data['status'] === 'published' && $announcement->status !== 'published') {
            $data['published_at'] = now();
        }

        $announcement->update($data);

        return to_route('admin.announcements.index');
    }

    /**
     * Menghapus data (Delete).
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return to_route('admin.announcements.index');
    }
}
