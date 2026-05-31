<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * @var array<int, string>
     */
    private array $categories = [
        'Food',
        'Transportation',
        'Utilities',
        'Education',
        'Health',
        'Entertainment',
        'Shopping',
        'Savings',
        'Other',
    ];

    public function run(): void
    {
        foreach ($this->categories as $category) {
            ExpenseCategory::query()->updateOrCreate(
                ['user_id' => null, 'slug' => Str::slug($category)],
                ['name' => $category, 'is_default' => true],
            );
        }
    }
}
