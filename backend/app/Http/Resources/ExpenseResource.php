<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => new ExpenseCategoryResource($this->category)),
            'title' => $this->title,
            'description' => $this->description,
            'amount' => $this->amount,
            'expense_date' => $this->expense_date?->toDateString(),
            'payment_method' => $this->payment_method,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
