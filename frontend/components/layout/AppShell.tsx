"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth-token";
import { apiRequest } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      clearToken();
      router.replace("/login");
    }
  }

  return (
    <div className="min-h-screen bg-panel">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-lg font-bold text-ink">
            FinSight AI
          </Link>
          <nav className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? "bg-teal-50 text-brand"
                    : "text-muted hover:bg-panel hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
