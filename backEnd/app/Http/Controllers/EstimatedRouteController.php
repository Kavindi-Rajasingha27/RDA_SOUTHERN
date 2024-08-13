<?php

namespace App\Http\Controllers;

use App\Models\EstimatedRoute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\DB;

class EstimatedRouteController extends Controller
{
    public function storeEstimatedRoute(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'start' => 'required|array',
                'start.lat' => 'required|numeric',
                'start.lng' => 'required|numeric',
                'end' => 'required|array',
                'end.lat' => 'required|numeric',
                'end.lng' => 'required|numeric',
                'distance' => 'required|numeric',
                'time' => 'required|numeric',
                'waypoints' => 'required|array',
                'waypoints.*.lat' => 'required|numeric',
                'waypoints.*.lng' => 'required|numeric',
            ]);

            $estimatedRoute = EstimatedRoute::create($validated);

            return response()->json($estimatedRoute, 201);
        } catch (Exception $e) {
            Log::error('Failed to store estimated route: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'error' => 'Failed to store estimated route. Please try again.'
            ], 500);
        }
    }

    public function getEstimatedRoutes(Request $request)
    {
        try {
            $area = $request->input('area');
    
            if ($area) {
                $parsedArea = json_decode($area, true);
    
                if (json_last_error() !== JSON_ERROR_NONE) {
                    info('JSON decoding error:', ['error' => json_last_error_msg()]);
                    return response()->json(['error' => 'Invalid area parameter'], 400);
                }
    
                if (count($parsedArea) > 0 && $parsedArea[0] !== end($parsedArea)) {
                    $parsedArea[] = $parsedArea[0];
                }
    
                $polygon = array_map(function ($coord) {
                    return [$coord['lng'], $coord['lat']];
                }, $parsedArea);
    
                $polygonText = 'POLYGON((' . implode(',', array_map(function ($point) {
                    return implode(' ', $point);
                }, $polygon)) . '))';
    
                $routes = EstimatedRoute::select('name', 'start', 'end', 'distance', 'time', 'waypoints')
                    ->whereRaw(
                        "ST_Within(waypoints_geom, ST_GeomFromText(?, 4326))",
                        [$polygonText]
                    )->get();
    
            } else {
                $routes = EstimatedRoute::select('name', 'start', 'end', 'distance', 'time', 'waypoints')->get();
            }
    
            $jsonData = json_encode($routes);
            if (json_last_error() !== JSON_ERROR_NONE) {
                info('JSON encoding error:', ['error' => json_last_error_msg()]);
                return response()->json(['error' => 'Error encoding data to JSON'], 500);
            }
    
            return response()->json($routes);
    
        } catch (\Exception $e) {
            info('Error fetching routes:', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function destroyEstimatedRoute($id)
    {
        $route = EstimatedRoute::find($id);

        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }

        $route->delete();

        return response()->json(['message' => 'Route deleted successfully'], 200);
    }
    
}
