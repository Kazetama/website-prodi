import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Search,
    User as UserIcon,
    GraduationCap,
    Hash,
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    nim?: string | null;
    program_studi?: string | null;
    fakultas?: string | null;
    angkatan?: number | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    users: {
        data: User[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Management', href: '/admin/users' },
];

const RoleBadge = ({ role }: { role: string }) => {
    const isAdmin = role.toLowerCase() === 'admin';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isAdmin
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted text-muted-foreground border-border'
            }`}>
            {role}
        </span>
    );
};

const UserAvatar = ({ name }: { name: string }) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-primary/10">
            {initials}
        </div>
    );
};

export default function AdminUsersIndex({ users, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            '/admin/users',
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin · Users" />
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            User Management
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage user access, roles, and academic information.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                            <Search className="h-4 w-4" />
                        </div>
                        <Input
                            placeholder="Search users..."
                            className="pl-9 bg-background border-muted-foreground/20 focus:border-primary transition-all"
                            defaultValue={filters.search ?? ''}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/40 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4 w-[300px]">User Profile</th>
                                    <th className="px-6 py-4">Status / Role</th>
                                    <th className="px-6 py-4">Academic Info</th>
                                    <th className="px-6 py-4">Angkatan</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                                    <Search className="h-6 w-6 opacity-50" />
                                                </div>
                                                <p className="font-medium">No users found</p>
                                                <p className="text-xs">Try adjusting your search terms.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar name={user.name} />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <RoleBadge role={user.role} />
                                                    {user.nim && (
                                                        <span className="text-[10px] text-muted-foreground font-mono mt-1 flex items-center gap-1">
                                                            <Hash className="h-3 w-3" /> {user.nim}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-[200px]">
                                                    {user.program_studi ? (
                                                        <>
                                                            <span className="font-medium truncate" title={user.program_studi}>
                                                                {user.program_studi}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate" title={user.fakultas ?? ''}>
                                                                {user.fakultas ?? '-'}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted-foreground/50 italic text-xs">
                                                            No academic data
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {user.angkatan ? (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>{user.angkatan}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/50 text-xs">-</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                        <div className="text-xs text-muted-foreground">
                            Showing data users
                        </div>
                        <div className="flex gap-1">
                            {users.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 px-3 text-xs ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url}>
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
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
