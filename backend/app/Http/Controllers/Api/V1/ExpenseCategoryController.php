<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseCategoryResource;
use App\Models\ExpenseCategory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExpenseCategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = ExpenseCategory::query()
            ->whereNull('user_id')
            ->orWhere('user_id', auth('api')->id())
            ->orderBy('name')
            ->get();

        return ExpenseCategoryResource::collection($categories);
    }
}
