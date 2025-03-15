<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    // Get all patients
    public function index()
    {
        try {
            // Fetch all patients from the database
            $patients = Patient::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Patients retrieved successfully',
                'data' => $patients
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Handle any unexpected errors, such as database or server issues
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve patients',
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Store a new patient
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'name' => 'required|string',
                'rm' => 'required|unique:patients,rm',
                'nik' => 'required|digits:16|unique:patients,nik',
                'alamat' => 'required|string'
            ]);

            // If validation passes, create the new patient record
            $patient = Patient::create($request->all());

            // Return success response with patient data
            return response()->json([
                'status' => 'success',
                'message' => 'Patient created successfully',
                'data' => $patient
            ], Response::HTTP_CREATED);
        } catch (ValidationException $e) {
            // If validation fails, return error with detailed validation errors
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'data' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // HTTP 422 - Unprocessable Entity
        } catch (\Exception $e) {
            // Handle unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create patient',
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Show details of a specific patient by ID
    public function show($id)
    {
        try {
            // Find the patient by ID
            $patient = Patient::find($id);
            if (!$patient) {
                // If patient not found, return an error response
                return response()->json([
                    'status' => 'error',
                    'message' => 'Patient not found',
                    'data' => null
                ], Response::HTTP_NOT_FOUND); // HTTP 404 - Not Found
            }

            // Return success response with patient data
            return response()->json([
                'status' => 'success',
                'message' => 'Patient retrieved successfully',
                'data' => $patient
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve patient',
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing patient's data
    public function update(Request $request, $id)
    {
        try {
            // Find the patient by ID
            $patient = Patient::find($id);
            if (!$patient) {
                // If patient not found, return an error response
                return response()->json([
                    'status' => 'error',
                    'message' => 'Patient not found',
                    'data' => null
                ], Response::HTTP_NOT_FOUND); // HTTP 404 - Not Found
            }

            // Validate the update request data
            $request->validate([
                'name' => 'nullable|string',
                'rm' => 'nullable|unique:patients,rm,' . $id,
                'nik' => 'nullable|digits:16|unique:patients,nik,' . $id,
                'alamat' => 'nullable|string',
            ]);

            // Update the patient's data
            $patient->update($request->all());

            // Return success response with updated patient data
            return response()->json([
                'status' => 'success',
                'message' => 'Patient updated successfully',
                'data' => $patient
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            // If validation fails, return error with detailed validation errors
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'data' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // HTTP 422 - Unprocessable Entity
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update patient',
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a patient by ID
    public function destroy($id)
    {
        try {
            // Find the patient by ID
            $patient = Patient::find($id);
            if (!$patient) {
                // If patient not found, return an error response
                return response()->json([
                    'status' => 'error',
                    'message' => 'Patient not found',
                    'data' => null
                ], Response::HTTP_NOT_FOUND); // HTTP 404 - Not Found
            }

            // Delete the patient record
            $patient->delete();

            // Return success response
            return response()->json([
                'status' => 'success',
                'message' => 'Patient deleted successfully',
                // 'data' => null
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete patient',
                // 'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
