<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            // ===============================
            // BASIC PROFILE
            // ===============================
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),

            // ===============================
            // ACADEMIC PROFILE
            // ===============================
            'nim' => $this->nimRules($userId),
            'program_studi' => $this->programStudiRules(),
            'fakultas' => $this->fakultasRules(),
            'angkatan' => $this->angkatanRules(),
            'no_hp' => $this->noHpRules(),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * NIM validation rules
     * contoh: F11.2023.00076
     */
    protected function nimRules(?int $userId = null): array
    {
        return [
            'nullable',
            'string',
            'max:30',
            'regex:/^[A-Z0-9]{1,5}\.[0-9]{4}\.[0-9]{5}$/',
            $userId === null
                ? Rule::unique(User::class, 'nim')
                : Rule::unique(User::class, 'nim')->ignore($userId),
        ];
    }

    /**
     * Program Studi validation rules
     */
    protected function programStudiRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * Fakultas validation rules
     */
    protected function fakultasRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * Angkatan validation rules
     */
    protected function angkatanRules(): array
    {
        return [
            'nullable',
            'digits:4',
            'integer',
            'min:2000',
            'max:' . now()->year,
        ];
    }

    /**
     * No HP validation rules
     */
    protected function noHpRules(): array
    {
        return [
            'nullable',
            'string',
            'max:20',
            'regex:/^08[0-9]{8,12}$/',
        ];
    }
}
