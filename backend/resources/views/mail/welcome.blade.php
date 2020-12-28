@extends('mail.layout')

@section('content')
<table style="width: 100%; min-width: 450px; border-collapse:collapse;">
    <tbody>
        <tr>
            <td style="font-size:1.25rem;font-weight:bold;padding:1rem 0">Welcome</td>
            <td style="padding:1rem 0">
                A user account has been created for you.
            </td>
            <td style="padding:1rem 0">
                Before you can log in, you need to set your secret password.
            </td>
            <td style="padding:1rem 0">
                <a style="padding:0.75rem 1rem;background-color:royalblue;color:white;" href="{{ $url }}">
                    Click here to set your password
                </a>
            </td>
        </tr>
    </tbody>
</table>
@endsection
