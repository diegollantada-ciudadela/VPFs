import {
  Administrador,
  CiudadelaRawAdmin,
  AccesoBanco,
  EstadoVPF,
} from "./types";
import ciudadelaData from "./ciudadela-data.json";

// Datos reales extraídos de Ciudadela (snapshot)
// TODO: Reemplazar con llamadas a la API GraphQL de Ciudadela cuando se configure
const rawAdmins = ciudadelaData as CiudadelaRawAdmin[];

// Datos de VPF del Google Sheet (mock por ahora - el sheet es privado)
// TODO: Conectar con Google Sheets API para obtener estado real
// Columnas: G=Banco, H=IBAN, J=Acceso Banco, K=Estado VPF
const vpfStatusByIban: Record<
  string,
  { accesoBanco: AccesoBanco; estadoVPF: EstadoVPF }
> = {};

function getVpfStatus(iban: string): {
  accesoBanco: AccesoBanco;
  estadoVPF: EstadoVPF;
} {
  // Si tenemos datos del Google Sheet, usarlos
  const clean = iban.replace(/\s/g, "");
  if (vpfStatusByIban[clean]) {
    return vpfStatusByIban[clean];
  }
  // Default: No iniciado
  return { accesoBanco: "Pendiente", estadoVPF: "No iniciado" };
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
        const status = getVpfStatus(ct.iban);
        return {
          iban: ct.iban,
          banco: ct.banco,
          accesoBanco: status.accesoBanco,
          estadoVPF: status.estadoVPF,
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
