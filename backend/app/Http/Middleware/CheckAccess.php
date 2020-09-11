<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permitted_roles)
    {
        /** @var \App\User */
        $user = $request->user();

        $roles = explode('|', $permitted_roles);
        $user_roles = explode('|', $user->roles);
        
        foreach ($roles as $role) {
            if (in_array($role, $user_roles)) {
                return $next($request);
            }
        }

        return false;
    }
}
