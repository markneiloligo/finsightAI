"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { ExpenseForm } from "@/features/expenses/ExpenseForm";
import { Alert } from "@/components/ui/Alert";
import type {
  ApiEnvelope,
  Expense,
  ExpenseCategory,
  ExpensePayload,
} from "@/types/api";

export default function NewExpensePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<ApiEnvelope<ExpenseCategory[]>>("/expense-categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        setError(error instanceof Error ? error.message : "Unable to load categories."),
      );
  }, []);

  async function createExpense(payload: ExpensePayload) {
    setSaving(true);
    setError("");

    try {
      await apiRequest<ApiEnvelope<Expense>>("/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/expenses");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create expense.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Add expense</h1>
        <p className="mt-2 text-sm text-muted">
          Record a new transaction in your personal spending history.
        </p>
      </div>

      {error ? <Alert message={error} /> : null}

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        <ExpenseForm
          categories={categories}
          loading={saving}
          onSubmit={createExpense}
        />
      </div>
    </section>
  );
}
