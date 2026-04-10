export type EstadoVPF = "Pendiente" | "En trámite" | "Completado" | "Rechazado" | "No iniciado";
export type AccesoBanco = "Sí" | "No" | "Pendiente";

export interface CuentaBancaria {
  iban: string;
  banco: string;
  accesoBanco: AccesoBanco;
  estadoVPF: EstadoVPF;
}

export interface Comunidad {
  nombre: string;
  cif: string;
  direccion: string;
  cuentas: CuentaBancaria[];
}

export interface Administrador {
  id: number;
  nombre: string;
  comunidades: Comunidad[];
}

// Estructura raw del JSON de Ciudadela
export interface CiudadelaRawCuenta {
  iban: string;
  banco: string;
}

export interface CiudadelaRawComunidad {
  nombre: string;
  cif: string;
  direccion: string;
  cuentas: CiudadelaRawCuenta[];
}

export interface CiudadelaRawAdmin {
  id: number;
  nombre: string;
  comunidades: CiudadelaRawComunidad[];
}
