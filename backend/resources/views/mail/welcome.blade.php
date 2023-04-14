@component('mail::layout')
@slot('header')
@component('mail::header', ['url' => config('app.url')])
{{ config('app.name') }}
@endcomponent
@endslot

# Welcome

A user account has been created for you.

Before you can log in, you need to set your secret password.

@component('mail::button', ['url' => $url])
Set Password
@endcomponent

@slot('subcopy')
@component('mail::subcopy')
If you’re having trouble clicking the "Reset Password" button, copy and paste
the URL below into your web browser: <span class="break-all"><{{ $url }}></span>
@endcomponent
@endslot

@slot('footer')
@component('mail::footer')
© {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')
@endcomponent
@endslot
@endcomponent
