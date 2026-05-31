"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { ExpenseForm } from "@/features/expenses/ExpenseForm";
import { Alert } from "@/components/ui/Alert";
import type {
  ApiEnvelope,
  Expense,
  ExpenseCategory,
  ExpensePayload,
} from "@/types/api";

export default function EditExpensePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest<ApiEnvelope<Expense>>(`/expenses/${id}`),
      apiRequest<ApiEnvelope<ExpenseCategory[]>>("/expense-categories"),
    ])
      .then(([expenseResponse, categoryResponse]) => {
        setExpense(expenseResponse.data);
        setCategories(categoryResponse.data);
      })
      .catch((error) =>
        setError(error instanceof Error ? error.message : "Unable to load expense."),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function updateExpense(payload: ExpensePayload) {
    setSaving(true);
    setError("");

    try {
      await apiRequest<ApiEnvelope<Expense>>(`/expenses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      router.push("/expenses");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update expense.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Edit expense</h1>
        <p className="mt-2 text-sm text-muted">
          Update the transaction details for this expense.
        </p>
      </div>

      {error ? <Alert message={error} /> : null}

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted">Loading expense...</p>
        ) : expense ? (
          <ExpenseForm
            categories={categories}
            initialExpense={expense}
            loading={saving}
            onSubmit={updateExpense}
          />
        ) : (
          <p className="text-sm text-muted">Expense not found.</p>
        )}
      </div>
    </section>
  );
}
