<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use Illuminate\Http\Request;

class EstimateController extends Controller
{
    // Create a new estimate
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start' => 'required|array',
            'end' => 'required|array',
            'distance' => 'required|numeric',
            'time' => 'required|numeric',
            'estimate' => 'required|numeric',
            'type' => 'nullable|string',
            'rate' => 'nullable|numeric',
            'waypoints' => 'required|array',
        ]);

        $estimate = Estimate::create($request->all());
        return response()->json($estimate, 201);
    }

    public function index(Request $request)
    {
        try {
            $area = $request->input('area');
    
            if ($area) {
                $parsedArea = json_decode($area, true);
    
                if (json_last_error() !== JSON_ERROR_NONE) {
                    info('JSON decoding error:', ['error' => json_last_error_msg()]);
                    return response()->json(['error' => 'Invalid area parameter'], 400);
                }
    
                if (!is_array($parsedArea) || count($parsedArea) === 0 || !isset($parsedArea[0][0], $parsedArea[0][1])) {
                    info('Area structure is invalid', ['area' => $parsedArea]);
                    return response()->json(['error' => 'Invalid area parameter'], 400);
                }
    
                if ($parsedArea[0] !== end($parsedArea)) {
                    $parsedArea[] = $parsedArea[0];
                }
    
                $polygonText = 'POLYGON((' . implode(',', array_map(function ($point) {
                    return implode(' ', array_reverse($point)); // Reverse to get lng lat format
                }, $parsedArea)) . '))';
    
                $estimates = Estimate::select('id', 'name', 'start', 'end', 'distance', 'time', 'estimate', 'type', 'rate', 'waypoints')
                    ->whereRaw(
                        "ST_Within(waypoints_geom, ST_GeomFromText(?, 4326))",
                        [$polygonText]
                    )->get();
            } else {
                $estimates = Estimate::select('id', 'name', 'start', 'end', 'distance', 'time', 'estimate', 'type', 'rate', 'waypoints')->get();
            }
    
            $jsonData = json_encode($estimates);
            if (json_last_error() !== JSON_ERROR_NONE) {
                info('JSON encoding error:', ['error' => json_last_error_msg()]);
                return response()->json(['error' => 'Error encoding data to JSON'], 500);
            }
    
            return response()->json($estimates);
        } catch (\Exception $e) {
            info('Error fetching estimates:', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    


    // Get a specific estimate by ID
    public function show($id)
    {
        $estimate = Estimate::find($id);
        if (!$estimate) {
            return response()->json(['error' => 'Estimate not found'], 404);
        }
    
        // Sanitize the fields to ensure proper UTF-8 encoding
        $this->sanitizeModel($estimate);
    
        return response()->json($estimate);
    }
    
    /**
     * Sanitize the model's attributes to ensure proper UTF-8 encoding.
     *
     * @param \App\Models\Estimate $estimate
     */
    protected function sanitizeModel($estimate)
    {
        foreach ($estimate->getAttributes() as $key => $value) {
            if (is_string($value)) {
                $estimate->$key = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }
        }
    }
    

    // Update an estimate by ID
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start' => 'sometimes|required|array',
            'end' => 'sometimes|required|array',
            'distance' => 'sometimes|required|numeric',
            'time' => 'sometimes|required|numeric',
            'estimate' => 'sometimes|required|numeric',
            'type' => 'nullable|string',
            'rate' => 'nullable|numeric',
            'waypoints' => 'sometimes|required|array',
        ]);

        $estimate = Estimate::find($id);
        if (!$estimate) {
            return response()->json(['error' => 'Estimate not found'], 404);
        }

        $estimate->update($request->all());
        return response()->json($estimate);
    }

    // Delete an estimate by ID
    public function destroy($id)
    {
        $estimate = Estimate::find($id);
        if (!$estimate) {
            return response()->json(['error' => 'Estimate not found'], 404);
        }

        $estimate->delete();
        return response()->json(['message' => 'Estimate deleted successfully']);
    }
}
