import {
  Administrador,
  CiudadelaRawAdmin,
  AccesoBanco,
  EstadoVPF,
} from "./types";
import ciudadelaData from "./ciudadela-data.json";
import vpfStatusData from "./vpf-status.json";

// Datos reales extraídos de Ciudadela (snapshot semanal)
const rawAdmins = ciudadelaData as CiudadelaRawAdmin[];

// Datos del Google Sheet (Banco, Acceso Banco, Estado VPF por IBAN)
const vpfData = vpfStatusData as Record<
  string,
  { banco: string; accesoBanco: string; estadoVPF: string }
>;

function getVpfStatus(iban: string): {
  banco: string | null;
  accesoBanco: AccesoBanco;
  estadoVPF: EstadoVPF;
} {
  const clean = iban.replace(/\s/g, "");
  const entry = vpfData[clean];
  if (entry) {
    return {
      banco: entry.banco || null,
      accesoBanco: (entry.accesoBanco as AccesoBanco) || "Pendiente",
      estadoVPF: (entry.estadoVPF as EstadoVPF) || "No iniciado",
    };
  }
  return { banco: null, accesoBanco: "Pendiente", estadoVPF: "No iniciado" };
}

function transformAdmin(raw: CiudadelaRawAdmin): Administrador {
  return {
    id: raw.id,
    nombre: raw.nombre,
    comunidades: raw.comunidades.map((c) => ({
      nombre: c.nombre,
      cif: c.cif,
      direccion: c.direccion,
      cuentas: c.cuentas.map((ct) => {
        const vpf = getVpfStatus(ct.iban);
        return {
          iban: ct.iban,
          banco: vpf.banco || ct.banco,
          accesoBanco: vpf.accesoBanco,
          estadoVPF: vpf.estadoVPF,
        };
      }),
    })),
  };
}

export function getAdminList(): { id: number; nombre: string }[] {
  return rawAdmins.map((a) => ({ id: a.id, nombre: a.nombre }));
}

export function getAdministradorById(id: number): Administrador | undefined {
  const raw = rawAdmins.find((a) => a.id === id);
  if (!raw) return undefined;
  return transformAdmin(raw);
}

export function searchAdministradores(
  query: string
): { id: number; nombre: string }[] {
  const q = query.toLowerCase();
  return rawAdmins
    .filter((a) => a.nombre.toLowerCase().includes(q))
    .map((a) => ({ id: a.id, nombre: a.nombre }));
}
