<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectByRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        if ($user->role === 'admin' && $request->is('dashboard')) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'user' && $request->is('admin/*')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
