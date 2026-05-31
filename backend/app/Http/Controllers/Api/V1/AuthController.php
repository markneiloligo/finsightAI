<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            'name' => $request->string('name'),
            'email' => $request->string('email')->lower(),
            'password' => $request->string('password'),
            'role' => 'user',
        ]);

        $token = Auth::guard('api')->login($user);

        return $this->respondWithToken($token, $user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        $token = Auth::guard('api')->attempt($credentials);

        if (! $token) {
            return response()->json([
                'error' => [
                    'code' => 'INVALID_CREDENTIALS',
                    'message' => 'The provided credentials are incorrect.',
                ],
            ], 401);
        }

        return $this->respondWithToken($token, Auth::guard('api')->user());
    }

    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return response()->json([
            'data' => [
                'message' => 'Logged out successfully.',
            ],
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'data' => new UserResource(Auth::guard('api')->user()),
        ]);
    }

    private function respondWithToken(string $token, User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            ],
        ], $status);
    }
}
