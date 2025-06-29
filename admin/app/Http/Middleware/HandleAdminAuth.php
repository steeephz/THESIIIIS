<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HandleAdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        // Debug logging
        Log::info('HandleAdminAuth middleware triggered', [
            'url' => $request->url(),
            'method' => $request->method(),
            'session_id' => $request->session()->getId(),
            'auth_check' => Auth::guard('web')->check(),
            'auth_user' => Auth::guard('web')->user() ? Auth::guard('web')->user()->toArray() : null
        ]);

        // Check if user is authenticated via web guard
        if (!Auth::guard('web')->check()) {
            Log::warning('User not authenticated, redirecting to login', [
                'url' => $request->url(),
                'session_id' => $request->session()->getId()
            ]);
            
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect('/')->with('error', 'Please log in to access the admin panel.');
        }

        Log::info('User authenticated, proceeding', [
            'user_id' => Auth::guard('web')->user()->id,
            'url' => $request->url()
        ]);

        $response = $next($request);
        // Add no-cache headers to all admin-authenticated responses
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');
        return $response;
    }
} 