import { Link, usePage } from '@inertiajs/react'
import { BookOpen, Folder, LayoutGrid, Shield } from 'lucide-react'

import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { dashboard } from '@/routes'
import admin from '@/routes/admin'

import type { NavItem, Role } from '@/types'
import AppLogo from './app-logo'

/* ======================================================
| NAV CONFIG
====================================================== */

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['user'],
    },
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
        icon: Shield,
        roles: ['admin'],
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
]

/* ======================================================
| COMPONENT
====================================================== */

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth?: {
            role?: Role
        }
    }

    const role = auth?.role ?? 'user'

    const filteredMainNavItems = mainNavItems.filter(
        item => !item.roles || item.roles.includes(role)
    )

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
