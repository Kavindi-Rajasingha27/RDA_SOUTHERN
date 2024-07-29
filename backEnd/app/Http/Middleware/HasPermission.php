<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HasPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $permission
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (auth('sanctum')->check()) {
            $status = auth('sanctum')->user()->status;
            if($status != 'active'){
                return response()->json(['error' => 'User Not Active'], 401);
            }   
            return $next($request);
        }
        else{
            return response()->json(['error' => 'Unauthorized action.'], 401);
        }
    }
}
