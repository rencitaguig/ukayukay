<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'customers';
    public $timestamps = false;
    protected $fillable = ['customerID', 'userId', 'fname', 'lname', 'email', 'phone', 'zipcode', 'address', 'image_path'];

    public function fullName(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Relationship
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    protected $primaryKey = 'user_id';
}
