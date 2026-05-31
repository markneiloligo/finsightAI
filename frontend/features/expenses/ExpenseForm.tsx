"use client";

import { useEffect, useState } from "react";
import { validateExpense } from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Expense, ExpenseCategory, ExpensePayload } from "@/types/api";

type ExpenseFormProps = {
  categories: ExpenseCategory[];
  initialExpense?: Expense;
  loading?: boolean;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({
  categories,
  initialExpense,
  loading = false,
  onSubmit,
}: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(today());
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialExpense) {
      return;
    }

    setTitle(initialExpense.title);
    setDescription(initialExpense.description ?? "");
    setAmount(initialExpense.amount);
    setExpenseDate(initialExpense.expense_date);
    setCategoryId(initialExpense.category_id?.toString() ?? "");
    setPaymentMethod(initialExpense.payment_method ?? "");
  }, [initialExpense]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const payload: ExpensePayload = {
      title: title.trim(),
      description: description.trim(),
      amount: Number(amount),
      expense_date: expenseDate,
      category_id: categoryId ? Number(categoryId) : null,
      payment_method: paymentMethod.trim(),
    };

    const validationError = validateExpense(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit(payload);
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      {error ? <Alert message={error} /> : null}

      <Field label="Title">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>

        <Field label="Expense date">
          <Input
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Payment method">
          <Input
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            placeholder="Card, cash, bank transfer"
          />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialExpense ? "Update expense" : "Add expense"}
        </Button>
      </div>
    </form>
  );
}
