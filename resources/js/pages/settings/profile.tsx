import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="max-w-3xl mx-auto space-y-10 py-6">
                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-8"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="space-y-6">
                                    <div>
                                        <Heading
                                            variant="small"
                                            title="Profile Information"
                                            description="Update akun dan informasi kontak pribadi Anda."
                                        />
                                        <div className="mt-4 border-b border-border/50"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-1">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={auth.user.name}
                                                required
                                                autoComplete="name"
                                                placeholder="Nama lengkap anda"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2 md:col-span-1">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                defaultValue={auth.user.email}
                                                required
                                                autoComplete="username"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div className="md:col-span-2 rounded-md bg-yellow-50 p-4 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900">
                                                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                                    Your email address is unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
                                                    >
                                                        Click here to resend the verification email.
                                                    </Link>
                                                </div>
                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                        A new verification link has been sent.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {auth.user.role === 'user' && (
                                    <div className="space-y-6 pt-2">
                                        <div>
                                            <Heading
                                                variant="small"
                                                title="Academic Information"
                                                description="Identitas akademik kemahasiswaan Anda."
                                            />
                                            <div className="mt-4 border-b border-border/50"></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="nim">NIM</Label>
                                                <Input
                                                    id="nim"
                                                    name="nim"
                                                    className="font-mono"
                                                    defaultValue={String(auth.user.nim ?? '')}
                                                    placeholder="Contoh: A11.2023.12345"
                                                />
                                                <InputError message={errors.nim} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="angkatan">Angkatan</Label>
                                                <Input
                                                    id="angkatan"
                                                    name="angkatan"
                                                    type="number"
                                                    min={2000}
                                                    max={2100}
                                                    defaultValue={auth.user.angkatan ? String(auth.user.angkatan) : ''}
                                                    placeholder="2023"
                                                />
                                                <InputError message={errors.angkatan} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="program_studi">Program Studi</Label>
                                                <Input
                                                    id="program_studi"
                                                    name="program_studi"
                                                    defaultValue={String(auth.user.program_studi ?? '')}
                                                    placeholder="Teknik Informatika"
                                                />
                                                <InputError message={errors.program_studi} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fakultas">Fakultas</Label>
                                                <Input
                                                    id="fakultas"
                                                    name="fakultas"
                                                    defaultValue={String(auth.user.fakultas ?? '')}
                                                    placeholder="Ilmu Komputer"
                                                />
                                                <InputError message={errors.fakultas} />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="no_hp">Nomor WhatsApp / HP</Label>
                                                <Input
                                                    id="no_hp"
                                                    name="no_hp"
                                                    defaultValue={String(auth.user.no_hp ?? '')}
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                                <InputError message={errors.no_hp} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0 translate-y-2"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600 font-medium">
                                            Changes saved successfully.
                                        </p>
                                    </Transition>

                                    <Button disabled={processing} size="lg">
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>

                    <div className="pt-10">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
