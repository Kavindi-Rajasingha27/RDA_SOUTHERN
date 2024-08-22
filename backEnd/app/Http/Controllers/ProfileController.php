<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class ProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated.'], 401);
            }

            return response()->json([
                'user' => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching the user profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
