@props(['title' => 'Thrift Lang'])

<header class="mx-auto">
	<div class="text-white bg-gray-800 border-b-2 navbar">
		{{-- LOGO --}}
		<div class="navbar-start">
			<a class="text-xl text-white btn btn-ghost hover:text-gray-300" href="{{ route('home') }}">
				{{ $title }}
			</a>
		</div>

		<div class="space-x-4 navbar-end">
			<div class="form-control">
				<div class="flex items-center justify-center space-x-1">
					<input type="text" placeholder="Search items" class="w-24 text-white placeholder-gray-400 bg-gray-700 border-gray-600 input input-bordered md:w-auto" />
					<div class="text-white rounded-full btn btn-ghost aspect-square hover:text-gray-300">
						<x-icons.search />
					</div>
				</div>
			</div>
			{{-- CART --}}
			{{-- if route is cart hide this --}}
			<div class="{{ Route::currentRouteName() == 'cart' ? 'hidden' : '' }} dropdown dropdown-end">
				<div tabindex="0" role="button" class="text-white btn btn-ghost btn-circle hover:text-gray-300">
					<div class="indicator">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<span id="cart-badge" class="text-white bg-red-600 cart-qty badge badge-sm indicator-item">0</span>
					</div>
				</div>
				<div tabindex="0" class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-gray-700 text-white shadow">
					<div class="card-body">
						<span class="text-lg font-bold">
							<span class="cart-qty">0</span> Item/s
						</span>
						<span class="text-info">Subtotal: PHP <span id="cart-sbt">0</span> </span>
						<div class="card-actions">
							<a href="/cart" id="cart-view" class="bg-blue-600 btn btn-primary btn-block hover:bg-blue-700">View cart</a>
						</div>
					</div>
				</div>
			</div>

			{{-- User --}}
			<div class="dropdown dropdown-end">
				<div class="flex items-center w-full space-x-1">
					@auth <span class="text-xs font-bold">{{ auth()->user()->username }}</span> @endauth

					<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
						@auth
							<div class="w-10 rounded-full">
								<img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
							</div>
						@else
							<div class="w-5 rounded-full">
								<img src="https://img.icons8.com/ios-glyphs/30/user--v1.png" alt="user icon" />
							</div>
						@endauth
					</div>
				</div>
				<ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-700 text-white rounded-box w-52">
					{{-- Authenticated User --}}
					@auth
						<li>
							<a class="justify-between">
								Profile
								<span class="badge">New</span>
							</a>
						</li>
						<li>
							<form id="logout-btn" method="POST" action="{{ route('logout') }}" class="flex">
								@csrf
								<button type="submit" class="w-full text-left">Logout</button>
							</form>
						</li>
					@else
						<li><a href="/register">Register</a></li>
						<li><a href="/login">Login</a></li>
					@endauth
				</ul>
			</div>
		</div>
	</div>

	@role('customer')
	@endrole
</header>
