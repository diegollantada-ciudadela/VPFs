import {
  Administrador,
  CiudadelaRawAdmin,
} from "./types";
import ciudadelaData from "./ciudadela-data.json";
import { readVpfExcel } from "./read-excel";

// Datos reales extraídos de Ciudadela (snapshot semanal)
const rawAdmins = ciudadelaData as CiudadelaRawAdmin[];

// Leer datos del Excel del Google Sheet (carpeta data/)
// Columnas: G=Banco, H=IBAN, J=Acceso Banco, K=Estado VPF
const vpfData = readVpfExcel();

function transformAdmin(raw: CiudadelaRawAdmin): Administrador {
  return {
    id: raw.id,
    nombre: raw.nombre,
    comunidades: raw.comunidades.map((c) => ({
      nombre: c.nombre,
      cif: c.cif,
      direccion: c.direccion,
      cuentas: c.cuentas.map((ct) => {
        const cleanIban = ct.iban.replace(/\s/g, "");
        const vpf = vpfData.get(cleanIban);
        return {
          iban: ct.iban,
          banco: vpf?.banco || ct.banco,
          accesoBanco: vpf?.accesoBanco ?? "Pendiente",
          estadoVPF: vpf?.estadoVPF ?? "No iniciado",
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
