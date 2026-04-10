"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/admin?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      router.push(`/dashboard?email=${encodeURIComponent(email)}`);
    } else {
      setError("No se encontró un administrador con ese correo electrónico.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)] mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Gestión de Autorizados
          </h1>
          <p className="text-[var(--muted)] mt-2">
            Plataforma VPF para administradores de fincas
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] p-8">
          <h2 className="text-lg font-semibold mb-1">Acceder al panel</h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            Introduce tu correo electrónico de administrador para ver tus
            comunidades.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.es"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Accediendo..." : "Acceder"}
            </button>
          </form>

          {/* Demo emails */}
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] mb-2">
              Emails de prueba:
            </p>
            <div className="flex flex-col gap-1">
              {[
                "maria.garcia@fincasgarcia.es",
                "carlos@adminrodriguez.com",
                "ana@gestionfernandez.es",
              ].map((demoEmail) => (
                <button
                  key={demoEmail}
                  type="button"
                  onClick={() => setEmail(demoEmail)}
                  className="text-xs text-[var(--primary-light)] hover:text-[var(--primary)] text-left cursor-pointer transition-colors"
                >
                  {demoEmail}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
