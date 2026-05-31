import type { ExpensePayload } from "@/types/api";

export function validateAuth(values: {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}): string | null {
  if (values.name !== undefined && values.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    return "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (
    values.password_confirmation !== undefined &&
    values.password !== values.password_confirmation
  ) {
    return "Passwords do not match.";
  }

  return null;
}

export function validateExpense(values: ExpensePayload): string | null {
  if (!values.title.trim()) {
    return "Expense title is required.";
  }

  if (!Number.isFinite(values.amount) || values.amount <= 0) {
    return "Amount must be greater than zero.";
  }

  if (!values.expense_date) {
    return "Expense date is required.";
  }

  return null;
}
