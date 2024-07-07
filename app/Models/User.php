<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $with = ['customer'];

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'status',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Scope Filter
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(
                fn ($query) =>
                $query->where('username', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    // role
                    ->orWhere('role', 'like', '%' . $search . '%')
                    // id
                    ->orWhere('id', 'like', '%' . $search . '%')
                    // id
                    ->orWhere('status', 'like', '%' . $search . '%')
                // customer.fullname



            );
        });
    }

    // Relationships

    // 1 : 1
    public function customer()
    {
        return $this->hasOne(Customer::class, 'user_id', 'id');
    }

    // N : n
    public function products()
    {
        return $this->belongsToMany(Product::class, 'customer_products')->withPivot('quantity');
    }

    // 1 : n
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
