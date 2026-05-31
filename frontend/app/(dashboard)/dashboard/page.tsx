"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import type { ApiEnvelope, User } from "@/types/api";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiRequest<ApiEnvelope<User>>("/auth/me")
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          {user ? `Welcome, ${user.name}.` : "Welcome to your finance workspace."}
        </p>
      </div>

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink">Phase 1 workspace</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          The dashboard is intentionally light for the MVP. Use the Expenses
          area to create, review, update, and delete your tracked spending.
        </p>
      </div>
    </section>
  );
}
