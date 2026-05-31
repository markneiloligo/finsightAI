"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { getToken, setToken } from "@/lib/auth-token";
import { validateAuth } from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { ApiEnvelope, AuthResponse } from "@/types/api";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateAuth({
      name: mode === "register" ? name : undefined,
      email,
      password,
      password_confirmation:
        mode === "register" ? passwordConfirmation : undefined,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload =
        mode === "register"
          ? {
              name,
              email,
              password,
              password_confirmation: passwordConfirmation,
            }
          : { email, password };

      const response = await apiRequest<ApiEnvelope<AuthResponse>>(
        mode === "register" ? "/auth/register" : "/auth/login",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify(payload),
        },
      );

      setToken(response.data.access_token);
      router.replace("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === "register";

  return (
    <main className="flex min-h-screen items-center justify-center bg-panel px-4">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            FinSight AI
          </p>
          <h1 className="mt-2 text-2xl font-bold text-ink">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isRegister
              ? "Start tracking your expenses with a clean finance workspace."
              : "Sign in to manage your expenses and budget activity."}
          </p>
        </div>

        <form className="grid gap-4" onSubmit={submit}>
          {error ? <Alert message={error} /> : null}

          {isRegister ? (
            <Field label="Name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </Field>
          ) : null}

          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </Field>

          {isRegister ? (
            <Field label="Confirm password">
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                autoComplete="new-password"
              />
            </Field>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-brand hover:text-teal-800"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </section>
    </main>
  );
}
