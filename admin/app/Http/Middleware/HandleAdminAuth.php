<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HandleAdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect('/');
        }

        // Ensure session doesn't expire
        $request->session()->migrate(true);
        $request->session()->regenerate(true);

        return $next($request);
    }
} 