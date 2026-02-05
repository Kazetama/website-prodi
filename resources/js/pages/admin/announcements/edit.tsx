import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Save,
    Calendar,
    Clock,
    MapPin,
    Type,
    AlignLeft,
    Globe,
    Trash2
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface AnnouncementData {
    id: number;
    title: string;
    content: string | null;
    event_date: string | null;
    event_time_start: string | null;
    event_time_end: string | null;
    location: string | null;
    status: 'draft' | 'published' | 'archived';
}

interface Props {
    announcement: AnnouncementData;
}

export default function AnnouncementEdit({ announcement }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title || '',
        content: announcement.content || '',
        event_date: announcement.event_date || '',
        event_time_start: announcement.event_time_start || '',
        event_time_end: announcement.event_time_end || '',
        location: announcement.location || '',
        status: announcement.status || 'draft',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/announcements/${announcement.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
            router.delete(`/admin/announcements/${announcement.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit · ${announcement.title}`} />
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground hover:text-foreground">
                            <Link href="/admin/announcements">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit Announcement
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Perbarui informasi pengumuman yang sudah ada.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Button onClick={submit} disabled={processing}>
                            {processing ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Update Changes</>}
                        </Button>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Type className="w-5 h-5 text-primary" />
                                        General Information
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Informasi utama pengumuman.
                                    </p>
                                </div>
                                <hr className="border-border/50" />

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Judul pengumuman..."
                                        className="text-lg font-medium py-6"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Isi konten..."
                                            className="min-h-[300px] resize-y leading-relaxed"
                                        />
                                        <AlignLeft className="absolute top-3 right-3 h-5 w-5 text-muted-foreground/30 pointer-events-none" />
                                    </div>
                                    <InputError message={errors.content} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Publish Settings
                                </h3>
                                <div className="space-y-3">
                                    <Label htmlFor="status">Visibility</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: any) => setData('status', value)}
                                    >
                                        <SelectTrigger className="w-full bg-background">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Select status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft (Disimpan)</SelectItem>
                                            <SelectItem value="published">Published (Tayang)</SelectItem>
                                            <SelectItem value="archived">Archived (Arsip)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="md:hidden pt-2">
                                    <Button className="w-full" disabled={processing}>
                                        Update Announcement
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-5">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Event Details
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Opsional, atur jika ada acara.</p>
                                </div>
                                <hr className="border-border/50" />

                                <div className="space-y-2">
                                    <Label htmlFor="event_date">Event Date</Label>
                                    <div className="relative">
                                        <Input
                                            id="event_date"
                                            type="date"
                                            value={data.event_date}
                                            onChange={(e) => setData('event_date', e.target.value)}
                                            className="pl-9"
                                        />
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={errors.event_date} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="event_time_start" className="text-xs">Start Time</Label>
                                        <div className="relative">
                                            <Input
                                                id="event_time_start"
                                                type="time"
                                                value={data.event_time_start}
                                                onChange={(e) => setData('event_time_start', e.target.value)}
                                                className="pl-8 text-xs px-1"
                                            />
                                            <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_time_end" className="text-xs">End Time</Label>
                                        <div className="relative">
                                            <Input
                                                id="event_time_end"
                                                type="time"
                                                value={data.event_time_end}
                                                onChange={(e) => setData('event_time_end', e.target.value)}
                                                className="pl-8 text-xs px-1"
                                            />
                                            <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="relative">
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Lokasi..."
                                            className="pl-9"
                                        />
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={errors.location} />
                                </div>
                            </div>

                            {/* CARD 3: DANGER ZONE (DELETE) */}
                            <div className="rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/50 p-5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                                    Danger Zone
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Menghapus pengumuman ini tidak dapat dibatalkan.
                                </p>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full bg-red-600 hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Announcement
                                </Button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
