<?php

namespace App\Http\Controllers;

use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register()
    {
        return view('auth.register');
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        $data['password'] = bcrypt($data['password']);

        $user = \App\Models\User::create($data);

        auth()->login($user);


        // EMAIL CODE HERE

        return redirect('/');
    }
    public function login()
    {
        return view('auth.login');
    }
    public function authenticate(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (auth()->attempt($data)) {
            $request->session()->regenerate();
            $token = auth()->user()->createToken('api-token')->plainTextToken;
            // Debugbar::info($token);
            $request->session()->put('api-token', $token);

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
    public function logout(Request $request)
    {
        auth()->logout();
        $request->session()->forget('api-token');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
