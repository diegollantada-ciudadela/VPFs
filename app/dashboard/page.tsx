"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Administrador, CuentaBancaria, EstadoVPF, Comunidad } from "@/lib/types";

function estadoColor(estado: EstadoVPF) {
  switch (estado) {
    case "Completado":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "En trámite":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Pendiente":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Rechazado":
      return "bg-red-100 text-red-800 border-red-200";
    case "No iniciado":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function estadoIcon(estado: EstadoVPF) {
  switch (estado) {
    case "Completado":
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "En trámite":
      return (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      );
    case "Pendiente":
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "Rechazado":
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "No iniciado":
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}

function accesoBancoLabel(acceso: string) {
  switch (acceso) {
    case "Sí":
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Sí
        </span>
      );
    case "No":
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          No
        </span>
      );
    case "Pendiente":
      return (
        <span className="inline-flex items-center gap-1 text-amber-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          Pendiente
        </span>
      );
  }
}

function bancoLogo(banco: string) {
  const colors: Record<string, string> = {
    CaixaBank: "bg-sky-600",
    Santander: "bg-red-600",
    BBVA: "bg-blue-700",
    "Banco Popular": "bg-green-700",
    Bankia: "bg-green-600",
    ING: "bg-orange-500",
    Bankinter: "bg-orange-600",
  };
  const initials = banco
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold ${colors[banco] || "bg-gray-500"}`}
    >
      {initials}
    </span>
  );
}

function TramitarButton({
  cuenta,
  comunidadNombre,
}: {
  cuenta: CuentaBancaria;
  comunidadNombre: string;
}) {
  const [showModal, setShowModal] = useState(false);

  if (cuenta.estadoVPF === "Completado") {
    return (
      <span className="text-xs text-[var(--muted)] italic">Completado</span>
    );
  }

  if (cuenta.estadoVPF === "En trámite") {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
      >
        Ver estado
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors cursor-pointer"
      >
        Tramitar VPF
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">
              Tramitar cambio de autorizados
            </h3>
            <div className="text-sm text-[var(--muted)] mb-4 space-y-2">
              <p>
                <span className="font-medium text-[var(--foreground)]">
                  Comunidad:
                </span>{" "}
                {comunidadNombre}
              </p>
              <p>
                <span className="font-medium text-[var(--foreground)]">
                  Banco:
                </span>{" "}
                {cuenta.banco}
              </p>
              <p>
                <span className="font-medium text-[var(--foreground)]">
                  IBAN:
                </span>{" "}
                {cuenta.iban}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-4">
              Se iniciará el proceso de variación de personas firmantes (VPF)
              para esta cuenta. Recibirás actualizaciones sobre el estado del
              trámite.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(
                    "Trámite iniciado correctamente. En producción, esto conectará con el sistema de gestión bancaria."
                  );
                  setShowModal(false);
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors cursor-pointer"
              >
                Confirmar trámite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-[var(--muted)]">Cargando...</div>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}

function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get("id");
  const [admin, setAdmin] = useState<Administrador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      router.push("/");
      return;
    }

    fetch(`/api/admin?id=${encodeURIComponent(adminId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setAdmin)
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [adminId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted)]">Cargando...</div>
      </div>
    );
  }

  if (!admin) return null;

  const totalCuentas = admin.comunidades.reduce(
    (acc, c) => acc + c.cuentas.length,
    0
  );
  const completados = admin.comunidades.reduce(
    (acc, c) => acc + c.cuentas.filter((ct) => ct.estadoVPF === "Completado").length,
    0
  );
  const enTramite = admin.comunidades.reduce(
    (acc, c) => acc + c.cuentas.filter((ct) => ct.estadoVPF === "En trámite").length,
    0
  );
  const pendientes = admin.comunidades.reduce(
    (acc, c) =>
      acc +
      c.cuentas.filter(
        (ct) =>
          ct.estadoVPF === "Pendiente" ||
          ct.estadoVPF === "No iniciado" ||
          ct.estadoVPF === "Rechazado"
      ).length,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="font-semibold text-lg">VPFs</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--muted)]">
                {admin.nombre}
              </span>
              <button
                onClick={() => router.push("/")}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Hola, {admin.nombre.split(" ")[0]}
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Gestiona los cambios de autorizados de tus comunidades
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="text-2xl font-bold">{admin.comunidades.length}</div>
            <div className="text-sm text-[var(--muted)]">Comunidades</div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {completados}
              <span className="text-sm font-normal text-[var(--muted)]">
                /{totalCuentas}
              </span>
            </div>
            <div className="text-sm text-[var(--muted)]">VPFs completados</div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="text-2xl font-bold text-blue-600">{enTramite}</div>
            <div className="text-sm text-[var(--muted)]">En trámite</div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="text-2xl font-bold text-amber-600">
              {pendientes}
            </div>
            <div className="text-sm text-[var(--muted)]">
              Pendientes / Acción requerida
            </div>
          </div>
        </div>

        {/* Communities */}
        <div className="space-y-6">
          {admin.comunidades.map((comunidad) => (
              <div
                key={comunidad.cif}
                className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
              >
                {/* Community Header */}
                <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-base">
                        {comunidad.nombre}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-[var(--muted)]">
                          CIF: <span className="font-mono">{comunidad.cif}</span>
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {comunidad.direccion}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium self-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Activa
                    </span>
                  </div>
                </div>

                {/* Accounts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[var(--muted)] uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Banco</th>
                        <th className="px-6 py-3 font-medium">IBAN</th>
                        <th className="px-6 py-3 font-medium">Acceso Banco</th>
                        <th className="px-6 py-3 font-medium">Estado VPF</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {comunidad.cuentas.map((cuenta, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {bancoLogo(cuenta.banco)}
                              <span className="font-medium">
                                {cuenta.banco}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs">
                              {cuenta.iban}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {accesoBancoLabel(cuenta.accesoBanco)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${estadoColor(cuenta.estadoVPF)}`}
                            >
                              {estadoIcon(cuenta.estadoVPF)}
                              {cuenta.estadoVPF}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <TramitarButton
                              cuenta={cuenta}
                              comunidadNombre={comunidad.nombre}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
