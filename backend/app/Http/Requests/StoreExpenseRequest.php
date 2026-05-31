<?php

namespace App\Http\Requests;

use App\Models\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('expense_categories', 'id')->where(function ($query): void {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', $this->user()->id);
                }),
            ],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:5000'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:999999999.99'],
            'expense_date' => ['required', 'date'],
            'payment_method' => ['nullable', 'string', 'max:80'],
        ];
    }
}
