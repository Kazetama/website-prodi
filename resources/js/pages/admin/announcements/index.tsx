import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    Megaphone,
    Calendar,
    Plus,
    MoreHorizontal,
    FileText,
    CheckCircle2,
    Clock,
    Edit,
    Trash,
    MapPin,
    ArrowRight
} from 'lucide-react';

// --- Interfaces ---
interface Announcement {
    id: number;
    title: string;
    content: string | null;     // Added content
    location: string | null;    // Added location
    event_date: string | null;  // Added event_date
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    announcements: {
        data: Announcement[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        published: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        archived: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
    };

    const icons = {
        published: <CheckCircle2 className="w-3 h-3 mr-1.5" />,
        draft: <FileText className="w-3 h-3 mr-1.5" />,
        archived: <Clock className="w-3 h-3 mr-1.5" />
    };

    const currentStyle = styles[status as keyof typeof styles] || styles.draft;
    const currentIcon = icons[status as keyof typeof icons] || icons.draft;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle} capitalize transition-colors`}>
            {currentIcon}
            {status}
        </span>
    );
};

export default function AnnouncementIndex({ announcements, filters }: Props) {

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            '/admin/announcements',
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
            router.delete(`/admin/announcements/${id}`);
        }
    };

    // Helper untuk format tanggal indonesia
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <AppLayout>
            <Head title="Admin · Announcements" />

            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">

                {/* --- HERO HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Megaphone className="h-6 w-6" />
                            </div>
                            Announcements
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base max-w-2xl">
                            Manage your organization's news, events, and updates. Use drafts to prepare content before publishing.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button asChild size="lg" className="shadow-md transition-all hover:shadow-lg">
                            <Link href="/admin/announcements/create">
                                <Plus className="mr-2 h-5 w-5" />
                                Create New
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* --- CONTROLS SECTION --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search title, content..."
                            className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all h-10"
                            defaultValue={filters.search ?? ''}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        Total Records: <span className="text-foreground">{announcements.total}</span>
                    </div>
                </div>

                {/* --- RICH TABLE CARD --- */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                                <tr>
                                    <th className="px-6 py-4 w-[50%]">Announcement Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Published At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {announcements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-2 ring-1 ring-border">
                                                    <Megaphone className="h-8 w-8 opacity-40" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-foreground">No announcements found</h3>
                                                <p className="text-sm max-w-xs mx-auto">
                                                    We couldn't find any announcements matching your search or filters.
                                                </p>
                                                <Button variant="outline" className="mt-4" asChild>
                                                    <Link href="/admin/announcements/create">Create your first one</Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    announcements.data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                                            {/* Column 1: Rich Info (Title, Excerpt, Metadata) */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-col gap-1.5">
                                                    {/* Title */}
                                                    <Link
                                                        href={`/admin/announcements/${item.id}/edit`}
                                                        className="font-semibold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                                                    >
                                                        {item.title}
                                                    </Link>

                                                    {/* Excerpt Content */}
                                                    {item.content && (
                                                        <p className="text-muted-foreground text-sm line-clamp-2 max-w-xl">
                                                            {item.content}
                                                        </p>
                                                    )}

                                                    {/* Metadata Row (Location & Event Date) */}
                                                    {(item.location || item.event_date) && (
                                                        <div className="flex items-center gap-4 mt-1.5">
                                                            {item.event_date && (
                                                                <div className="flex items-center text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                                                    <Calendar className="h-3 w-3 mr-1.5 text-blue-500" />
                                                                    <span>Event: {formatDate(item.event_date)}</span>
                                                                </div>
                                                            )}
                                                            {item.location && (
                                                                <div className="flex items-center text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                                                    <MapPin className="h-3 w-3 mr-1.5 text-red-500" />
                                                                    <span>{item.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 2: Status */}
                                            <td className="px-6 py-5 align-top">
                                                <StatusBadge status={item.status} />
                                            </td>

                                            {/* Column 3: Date */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {item.published_at ? formatDate(item.published_at) : 'Not published'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground mt-0.5">
                                                        Created: {formatDate(item.created_at)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Column 4: Actions */}
                                            <td className="px-6 py-5 align-top text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {/* Edit Action */}
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/announcements/${item.id}/edit`} className="cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Details
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem asChild>
                                                            <Link href="#" className="cursor-pointer">
                                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                                View Preview
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        {/* Delete Action */}
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION FOOTER --- */}
                    <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                        <div className="text-xs text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{announcements.from}</span> to <span className="font-medium text-foreground">{announcements.to}</span> of {announcements.total} results
                        </div>
                        <div className="flex gap-1">
                            {announcements.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 min-w-[32px] px-3 text-xs ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
