<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::orderBy('id', 'DESC')->get();
        return response()->json($announcements);
    }
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'title' => 'required|string|max:255',
            'date_of_arrival' => 'required|date',
            'description' => 'required|string',
            'uploads.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate each file
        ]);
    
        // Create a new announcement
        $announcement = new Announcement;
        $announcement->title = $request->input('title');
        $announcement->date_of_arrival = $request->input('date_of_arrival');
        $announcement->description = $request->input('description');
    
        // Check if the request has any files and process them
        if ($request->hasFile('uploads')) {
            $imagePaths = [];
            foreach ($request->file('uploads') as $file) {
                $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images'), $fileName);  // Move file to public/images directory
                $imagePaths[] = 'images/' . $fileName;
            }
            // Save the file paths as a comma-separated string
            $announcement->image = implode(',', $imagePaths);
        }
    
        // Save the announcement to the database
        $announcement->save();
    
        // Redirect back with success message
        return redirect()->back()->with('success', 'Announcement created successfully.');
    }


    public function update(Request $request, string $id)
{
    $announcement = Announcement::findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'date_of_arrival' => 'required|date',
        'description' => 'required|string',
        'uploads.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate each file
    ]);

    // Update announcement fields
    $announcement->title = $request->input('title');
    $announcement->date_of_arrival = $request->input('date_of_arrival');
    $announcement->description = $request->input('description');

    // Handle image uploads if files are present
    if ($request->hasFile('uploads')) {
        $imagePaths = [];
        foreach ($request->file('uploads') as $file) {
            $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/images', $fileName); // Store file in storage/app/public/images
            $imagePaths[] = 'storage/images/' . $fileName; // Store path in array
        }
        $announcement->image = implode(',', $imagePaths); // Save paths as comma-separated string
    }

    // Save updated announcement information
    $announcement->save();

    return response()->json([
        'success' => 'Announcement updated successfully.',
        'announcement' => $announcement

    ]);
    
}

public function destroy(string $id)
{
    $announcement = Announcement::findOrFail($id);
    $announcement->delete();
    return response()->json(["success" => "Announcement deleted successfully."]);
}
}
