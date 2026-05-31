"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { Expense, PaginatedEnvelope } from "@/types/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const total = useMemo(
    () =>
      expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses],
  );

  useEffect(() => {
    apiRequest<PaginatedEnvelope<Expense>>("/expenses")
      .then((response) => setExpenses(response.data))
      .catch((error) =>
        setError(error instanceof Error ? error.message : "Unable to load expenses."),
      )
      .finally(() => setLoading(false));
  }, []);

  async function deleteExpense(id: number) {
    const confirmed = window.confirm("Delete this expense?");
    if (!confirmed) {
      return;
    }

    await apiRequest(`/expenses/${id}`, { method: "DELETE" });
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Expenses</h1>
          <p className="mt-2 text-sm text-muted">
            Track and maintain your spending records.
          </p>
        </div>
        <Link href="/expenses/new">
          <Button>Add expense</Button>
        </Link>
      </div>

      <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
        <p className="text-sm text-muted">Current page total</p>
        <p className="mt-1 text-2xl font-bold text-ink">${total.toFixed(2)}</p>
      </div>

      {error ? <Alert message={error} /> : null}

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <div className="p-6">
            <p className="text-sm font-medium text-ink">No expenses yet.</p>
            <p className="mt-1 text-sm text-muted">
              Add your first expense to start building your spending history.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-ink">{expense.title}</h2>
                    <span className="rounded-full bg-panel px-2 py-1 text-xs text-muted">
                      {expense.category?.name ?? "Uncategorized"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {expense.expense_date}
                    {expense.payment_method ? ` · ${expense.payment_method}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="min-w-24 text-right font-semibold text-ink">
                    ${Number(expense.amount).toFixed(2)}
                  </p>
                  <Link
                    href={`/expenses/${expense.id}/edit`}
                    className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-panel"
                  >
                    Edit
                  </Link>
                  <button
                    className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
