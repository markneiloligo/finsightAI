<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ExpenseController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $expenses = Expense::query()
            ->with('category')
            ->where('user_id', auth('api')->id())
            ->latest('expense_date')
            ->latest()
            ->paginate(request()->integer('per_page', 15));

        return ExpenseResource::collection($expenses);
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => new ExpenseResource($expense->load('category')),
        ], 201);
    }

    public function show(Expense $expense): ExpenseResource
    {
        $this->authorizeExpense($expense);

        return new ExpenseResource($expense->load('category'));
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): ExpenseResource
    {
        $this->authorizeExpense($expense);

        $expense->update($request->validated());

        return new ExpenseResource($expense->load('category'));
    }

    public function destroy(Expense $expense): Response
    {
        $this->authorizeExpense($expense);

        $expense->delete();

        return response()->noContent();
    }

    private function authorizeExpense(Expense $expense): void
    {
        abort_unless($expense->user_id === auth('api')->id(), 404);
    }
}
