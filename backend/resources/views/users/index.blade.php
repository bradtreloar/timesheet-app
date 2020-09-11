@extends('layouts.app')

@section('content')
<div class="container">
    @foreach ($users as $user)
    <div class="card">
        <div class="card-body">
            <p>This is user {{ $user->id }}</p>
        </div>
    </div>
    @endforeach
</div>
@endsection