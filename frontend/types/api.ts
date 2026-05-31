export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  user: User;
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

export type ExpenseCategory = {
  id: number;
  name: string;
  slug: string;
  is_default: boolean;
};

export type Expense = {
  id: number;
  user_id: number;
  category_id: number | null;
  category?: ExpenseCategory | null;
  title: string;
  description: string | null;
  amount: string;
  expense_date: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpensePayload = {
  category_id: number | null;
  title: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: string;
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type PaginatedEnvelope<T> = {
  data: T[];
  links?: Record<string, string | null>;
  meta?: Record<string, unknown>;
};
