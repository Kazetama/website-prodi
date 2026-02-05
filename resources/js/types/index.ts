export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    nim?: string | null;
    program_studi?: string | null;
    fakultas?: string | null;
    angkatan?: number | null;
};


