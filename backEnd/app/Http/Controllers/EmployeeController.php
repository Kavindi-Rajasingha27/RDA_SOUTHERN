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
    public function getAllEmployees(){
        try {
            $employees = Employee::with(['dependents', 'qualifications'])->get();
            return $employees;
        } catch (\Exception $e) {
            info('Error fetching employees: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch employees'], 500);
        }
    }

    public function createEmployee(Request $request){
        try {
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

    public function getOneEmployee(Employee $employee){
        try {
            $employee->load(['dependents', 'qualifications']);
            return response()->json($employee, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch employee details', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateEmployee(Request $request, Employee $employee){
        try {
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
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update employee', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function deleteEmployee(Employee $employee){
        try {
            $employee->delete();
            return response()->json(['message' => 'Employee successfully deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete employee', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function searchEmployees(Request $request){
        try {
            $query = Employee::query();
    
            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }
            if ($request->has('designation')) {
                $query->where('designation', 'like', '%' . $request->input('designation') . '%');
            }
    
            $employees = $query->with(['dependents', 'qualifications'])->get();
    
            return response()->json($employees, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to search employees', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function storeDependent(Request $request, Employee $employee){
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'relationship' => 'required|string|max:255',
                'birth_date' => 'required|date'
            ]);
    
            $dependent = new Dependent($validatedData);
            
            $employee->dependents()->save($dependent);
    
            return response()->json($dependent, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to store dependent', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateDependent(Request $request, Employee $employee, Dependent $dependent){
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'relationship' => 'required|string|max:255',
                'birth_date' => 'required|date'
            ]);
    
            $dependent->update($validatedData);
    
            return response()->json($dependent, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update dependent', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function destroyDependent(Employee $employee, Dependent $dependent){
        try {
            $dependent->delete();
            return response()->json(['message' => 'Dependent successfully deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete dependent', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function storeQualification(Request $request, Employee $employee){
        try {
            $validatedData = $request->validate([
                'qualification_name' => 'required|string|max:255',
                'institute' => 'required|string|max:255',
                'obtained_date' => 'required|date'
            ]);
    
            $qualification = new Qualification($validatedData);
            $employee->qualifications()->save($qualification);
    
            return response()->json($qualification, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to store qualification', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function updateQualification(Request $request, Employee $employee, Qualification $qualification){
        try {
            $validatedData = $request->validate([
                'qualification_name' => 'required|string|max:255',
                'institute' => 'required|string|max:255',
                'obtained_date' => 'required|date'
            ]);
    
            $qualification->update($validatedData);
    
            return response()->json($qualification, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update qualification', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function destroyQualification(Employee $employee, Qualification $qualification){
        try {
            $qualification->delete();
            return response()->json(['message' => 'Qualification successfully deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete qualification', 'message' => $e->getMessage()], 500);
        }
    }
    
}
