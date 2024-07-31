<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Dependent;
use App\Models\Qualification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    // Display a listing of employees
    public function index()
    {
        return Employee::with(['dependents', 'qualifications'])->get();
    }

    // Store a newly created employee in storage
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'employee_number' => ['required', 'string', 'max:255', Rule::unique('employees', 'employee_number')],
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'address' => 'required|string|max:255',
            'birthday' => 'required|date',
            'designation' => 'required|string|max:255',
            'corporate_title' => 'required|string|max:255',
            'join_date' => 'required|date',
            'etf_number' => 'required|string|max:255',
            'contact_details' => 'required|string|max:255',
            'dependents' => 'array',
            'dependents.*.name' => 'required_with:dependents|string|max:255',
            'dependents.*.relationship' => 'required_with:dependents|string|max:255',
            'dependents.*.birth_date' => 'required_with:dependents|date',
            'qualifications' => 'array',
            'qualifications.*.qualification_name' => 'required_with:qualifications|string|max:255',
            'qualifications.*.institute' => 'required_with:qualifications|string|max:255',
            'qualifications.*.obtained_date' => 'required_with:qualifications|date'
        ]);
    
        DB::beginTransaction();
    
        try {
            $employee = Employee::create($validatedData);
    
            if (isset($validatedData['dependents']) && !empty($validatedData['dependents'])) {
                foreach ($validatedData['dependents'] as $dependentData) {
                    $employee->dependents()->create($dependentData);
                }
            }
    
            if (isset($validatedData['qualifications']) && !empty($validatedData['qualifications'])) {
                foreach ($validatedData['qualifications'] as $qualificationData) {
                    $employee->qualifications()->create($qualificationData);
                }
            }
    
            DB::commit();
    
            return response()->json($employee->load(['dependents', 'qualifications']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create employee', 'message' => $e->getMessage()], 500);
        }
    }

    // Display the specified employee
    public function show(Employee $employee)
    {
        return $employee->load(['dependents', 'qualifications']);
    }

    // Update the specified employee in storage
    public function update(Request $request, Employee $employee)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'address' => 'required|string|max:255',
            'birthday' => 'required|date',
            'designation' => 'required|string|max:255',
            'corporate_title' => 'required|string|max:255',
            'join_date' => 'required|date',
            'etf_number' => 'required|string|max:255',
            'contact_details' => 'required|string|max:255'
        ]);

        $employee->update($validatedData);

        return response()->json($employee->load(['dependents', 'qualifications']), 200);
    }

    // Remove the specified employee from storage
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(['message' => 'Employee successfully deleted.'], 200);

    }

    // Search for employees based on criteria
    public function search(Request $request)
    {
        $query = Employee::query();
    
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }
        if ($request->has('designation')) {
            $query->where('designation', 'like', '%' . $request->input('designation') . '%');
        }
        // Add more search criteria as needed
    
        $employees = $query->with(['dependents', 'qualifications'])->get();
    
        return response()->json($employees, 200);
    }
    

    // Store a newly created dependent in storage
    public function storeDependent(Request $request, Employee $employee)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'birth_date' => 'required|date'
        ]);

        $dependent = new Dependent($validatedData);
        $employee->dependents()->save($dependent);

        return response()->json($dependent, 201);
    }

    // Update the specified dependent in storage
    public function updateDependent(Request $request,  Employee $employee, Dependent $dependent)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'birth_date' => 'required|date'
        ]);

        $dependent->update($validatedData);

        return response()->json($dependent, 200);
    }

    // Remove the specified dependent from storage
    public function destroyDependent( Employee $employee, Dependent $dependent)
    {
        $dependent->delete();

        return response()->json(['message' => 'Dependent successfully deleted.'], 200);
    }

    // Store a newly created qualification in storage
    public function storeQualification(Request $request, Employee $employee)
    {
        $validatedData = $request->validate([
            'qualification_name' => 'required|string|max:255',
            'institute' => 'required|string|max:255',
            'obtained_date' => 'required|date'
        ]);

        $qualification = new Qualification($validatedData);
        $employee->qualifications()->save($qualification);

        return response()->json($qualification, 201);
    }

    // Update the specified qualification in storage
    public function updateQualification(Request $request,  Employee $employee, Qualification $qualification)
    {
        $validatedData = $request->validate([
            'qualification_name' => 'required|string|max:255',
            'institute' => 'required|string|max:255',
            'obtained_date' => 'required|date'
        ]);

        $qualification->update($validatedData);

        return response()->json($qualification, 200);
    }

    // Remove the specified qualification from storage
    public function destroyQualification( Employee $employee, Qualification $qualification)
    {
        $qualification->delete();

        return response()->json(['message' => 'Qualification successfully deleted.'], 200);
    }
}
