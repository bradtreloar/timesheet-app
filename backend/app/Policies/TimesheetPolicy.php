<?php

namespace App\Policies;

use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class TimesheetPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        // Allow all actions by admin users.
        if ($user->is_admin) {
            return true;
        }

        // Deny all actions by users without a verified email address.
        if (!$user->hasVerifiedEmail()) {
            return false;
        }
    }

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Timesheet  $timesheet
     * @return bool
     */
    public function view(User $user, Timesheet $timesheet): bool
    {
        return $user->is($timesheet->user);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $owner
     *   The user this timesheet will belong to.
     * @return bool
     */
    public function create(User $user, User $owner): bool
    {
        return $user->is($owner);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Timesheet  $timesheet
     * @return bool
     */
    public function update(User $user, Timesheet $timesheet): bool
    {
        // User can only update the timesheet if they own it and it isn't
        // flagged as completed.
        return $user->is($timesheet->user) && $timesheet->is_completed === false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Timesheet  $timesheet
     * @return bool
     */
    public function delete(User $user, Timesheet $timesheet): bool
    {
        return $user->is($timesheet->user);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Timesheet  $timesheet
     * @return bool
     */
    public function restore(User $user, Timesheet $timesheet): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Timesheet  $timesheet
     * @return bool
     */
    public function forceDelete(User $user, Timesheet $timesheet): bool
    {
        return false;
    }
}
