"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminOption {
  id: number;
  nombre: string;
}

export default function LoginPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<AdminOption | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/admin?search=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (admin: AdminOption) => {
    setSelected(admin);
    setQuery(admin.nombre);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    router.push(`/dashboard?id=${selected.id}`);
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
            Busca tu nombre para acceder a tus comunidades.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative" ref={dropdownRef}>
              <label
                htmlFor="admin-search"
                className="block text-sm font-medium mb-2"
              >
                Administrador
              </label>
              <input
                id="admin-search"
                type="text"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                placeholder="Escribe tu nombre..."
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent transition-all"
              />

              {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {results.map((admin) => (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => handleSelect(admin)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors cursor-pointer border-b border-[var(--border)] last:border-b-0"
                    >
                      <span className="font-medium">{admin.nombre}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && results.length === 0 && !selected && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  No se encontraron administradores
                </p>
              )}
            </div>

            {selected && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {selected.nombre}
              </div>
            )}

            <button
              type="submit"
              disabled={!selected || loading}
              className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Accediendo..." : "Acceder"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-4">
          Datos de comunidades activas de Ciudadela
        </p>
      </div>
    </div>
  );
}
