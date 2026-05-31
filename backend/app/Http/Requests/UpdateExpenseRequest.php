<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('expense')?->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('expense_categories', 'id')->where(function ($query): void {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', $this->user()->id);
                }),
            ],
            'title' => ['sometimes', 'required', 'string', 'max:160'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'amount' => ['sometimes', 'required', 'numeric', 'gt:0', 'max:999999999.99'],
            'expense_date' => ['sometimes', 'required', 'date'],
            'payment_method' => ['sometimes', 'nullable', 'string', 'max:80'],
        ];
    }
}
