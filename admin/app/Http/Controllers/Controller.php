<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        // Prevent browser caching of authenticated pages
        \Illuminate\Support\Facades\View::composer('*', function ($view) {
            if (request()->user()) {
                \Illuminate\Support\Facades\Response::macro('nocache', function ($response) {
                    return $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, private')
                        ->header('Pragma', 'no-cache')
                        ->header('Expires', '0');
                });
            }
        });
    }
}
