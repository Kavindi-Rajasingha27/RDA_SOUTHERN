<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use Illuminate\Http\Request;

class EstimateController extends Controller
{
    // Create a new estimate
    public function store(Request $request)
    {
        // Step 1: Validate the request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'start' => 'required|array',
            'end' => 'required|array',
            'distance' => 'required|numeric',
            'time' => 'required|numeric',
            'estimate' => 'required|numeric',
            'type' => 'nullable|string',
            'rate' => 'nullable|numeric',
            'waypoints' => 'required|array',
            'document' => 'nullable|file',
        ]);

        // Step 2: Create the estimate
        $estimate = Estimate::create($validatedData);

        // Step 3: Define the storage path
        $storagePath = storage_path("app/estimates/{$estimate->id}");

        // Create the folder if it doesn't exist
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0755, true); // Create the directory with permissions
        }

        // Step 4: Rename and store the document (if uploaded)
        if ($request->hasFile('document')) {
            $document = $request->file('document');

            // Get the original extension
            $extension = $document->getClientOriginalExtension();

            // Rename the document to estimate id with its extension
            $documentName = "{$estimate->id}.{$extension}";

            // Move the document to the specific folder
            $document->move($storagePath, $documentName);

            // Save the document path to the estimate
            $estimate->document_path = "estimates/{$estimate->id}/{$documentName}";
            $estimate->save();
        }

        // Step 5: Return the estimate with the document path
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

                $estimates = Estimate::select('id', 'name', 'start', 'end', 'distance', 'time', 'estimate', 'type', 'rate', 'waypoints', 'status')
                    ->whereRaw(
                        "ST_Within(waypoints_geom, ST_GeomFromText(?, 4326))",
                        [$polygonText]
                    )->get();
            } else {
                $estimates = Estimate::select('id', 'name', 'start', 'end', 'distance', 'time', 'estimate', 'type', 'rate', 'waypoints', 'status')->get();
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

    public function updateStatus(Request $request, Estimate $estimate)
    {
        try {
            // Step 1: Validate the incoming data
            $validatedData = $request->validate([
                'status' => 'required|string', // Status must be provided
                'document' => 'nullable|file', // Document is optional
            ]);

            // Step 2: Update the status
            $estimate->status = $validatedData['status'];

            // Step 3: Handle the document upload and renaming (if a new document is uploaded)
            if ($request->hasFile('document')) {
                $document = $request->file('document');

                // Define the storage path
                $storagePath = storage_path("app/estimates/{$estimate->id}");

                // Ensure the directory exists
                if (!file_exists($storagePath)) {
                    mkdir($storagePath, 0755, true); // Create the directory if not exists
                }

                // Get the file's extension and rename the document
                $extension = $document->getClientOriginalExtension();
                $documentName = "{$estimate->id}.{$extension}";

                // Move the document to the specified folder
                $document->move($storagePath, $documentName);

                // Update the document path in the estimate
                $estimate->document_path = "estimates/{$estimate->id}/{$documentName}";
            }

            // Step 4: Save the estimate
            $estimate->save();

            // Step 5: Return a response
            return response()->json(['message' => 'Estimate updated successfully', 'estimate' => $estimate], 200);
        } catch (\Throwable $th) {
            info($th);
        }
    }

    public function downloadDocument($id)
    {
        try {
            // Find the estimate by ID
            $estimate = Estimate::findOrFail($id);

            // Check if the document path is set
            if (!$estimate->document_path) {
                return response()->json(['message' => 'No document found for this estimate'], 404);
            }

            // Define the full path to the document
            $filePath = storage_path("app/{$estimate->document_path}");

            // Check if the file exists
            if (!file_exists($filePath)) {
                return response()->json(['message' => 'Document not found'], 404);
            }

            // Return the file as a response for download
            return response()->download($filePath);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
}
