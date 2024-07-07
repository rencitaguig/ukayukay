<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('index');
})->name('home');


Route::view('/customer-all', 'customer.index');
Route::view('/brand-all', 'brand.index');


require __DIR__ . '/auth.php';
