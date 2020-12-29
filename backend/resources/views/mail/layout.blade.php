<html>
    <body>
        <div style="background: #f0f0f0; padding: 1rem 0.5rem; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div style="background: #ffffff; padding: 1rem 0.5rem; width: 100%; max-width: 720px; margin: 0 auto;">
                <div style="text-align:center; padding-bottom: 1rem; border-bottom: solid 1px #cccccc; margin-bottom: 1rem;">
                    <a style="display: inline-block;" href="{{ url('/') }}">
                        <img style="display: block" src="{{ $message->embed(public_path() . "/images/logo.png") }}" alt="{{ config('app.name', 'Laravel') }}"/>
                    </a>
                </div>
                <div>
                    <table style="margin: 0 auto; width: 100%; max-width: 720px;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif">
                        <tbody>
                            <tr>
                                <td>
                                    @yield('content')
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="padding:1rem 0.5rem;width:100%;max-width: 720px;margin: 0 auto;font-weight:bold">
                {{ config('app.name', 'Laravel') }}
            </div>
        </div>
    </body>
</html>
