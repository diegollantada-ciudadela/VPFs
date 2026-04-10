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
  activa: boolean;
  cuentas: CuentaBancaria[];
}

export interface Administrador {
  id: string;
  nombre: string;
  email: string;
  comunidades: Comunidad[];
}
