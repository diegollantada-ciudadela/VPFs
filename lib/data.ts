import { Administrador } from "./types";

// Datos de ejemplo - En producción se obtendrán del MCP de Ciudadela y Google Sheets
export const administradores: Administrador[] = [
  {
    id: "admin-001",
    nombre: "María García López",
    email: "maria.garcia@fincasgarcia.es",
    comunidades: [
      {
        nombre: "Comunidad Residencial Las Palmeras",
        cif: "H-12345678",
        direccion: "C/ Las Palmeras 12, 28001 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES91 2100 0418 4502 0005 1332",
            banco: "CaixaBank",
            accesoBanco: "Sí",
            estadoVPF: "Completado",
          },
        ],
      },
      {
        nombre: "Comunidad Edificio Sol",
        cif: "H-23456789",
        direccion: "Av. del Sol 45, 28002 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES68 0049 1500 0512 3456 7890",
            banco: "Santander",
            accesoBanco: "Sí",
            estadoVPF: "En trámite",
          },
          {
            iban: "ES21 0182 2370 4200 1566 3456",
            banco: "BBVA",
            accesoBanco: "Pendiente",
            estadoVPF: "Pendiente",
          },
        ],
      },
      {
        nombre: "Comunidad Plaza Mayor 8",
        cif: "H-34567890",
        direccion: "Plaza Mayor 8, 28003 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES55 0075 0001 0906 0012 3456",
            banco: "Banco Popular",
            accesoBanco: "No",
            estadoVPF: "No iniciado",
          },
        ],
      },
      {
        nombre: "Comunidad Jardines del Norte",
        cif: "H-45678901",
        direccion: "C/ Jardines 3, 28004 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES12 2038 1000 9000 0076 0236",
            banco: "Bankia",
            accesoBanco: "Sí",
            estadoVPF: "Rechazado",
          },
        ],
      },
    ],
  },
  {
    id: "admin-002",
    nombre: "Carlos Rodríguez Martín",
    email: "carlos@adminrodriguez.com",
    comunidades: [
      {
        nombre: "Residencial Puerta de Hierro",
        cif: "H-56789012",
        direccion: "C/ Puerta de Hierro 22, 28035 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES80 2310 0001 1800 0012 3456",
            banco: "ING",
            accesoBanco: "Sí",
            estadoVPF: "Completado",
          },
        ],
      },
      {
        nombre: "Comunidad Torre Picasso",
        cif: "H-67890123",
        direccion: "Av. AZCA 1, 28020 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES15 0049 2648 7123 4567 8901",
            banco: "Santander",
            accesoBanco: "No",
            estadoVPF: "No iniciado",
          },
          {
            iban: "ES33 2100 5731 0721 0015 8276",
            banco: "CaixaBank",
            accesoBanco: "Sí",
            estadoVPF: "En trámite",
          },
        ],
      },
      {
        nombre: "Comunidad Parque Retiro",
        cif: "H-78901234",
        direccion: "C/ Retiro 15, 28009 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES44 0182 5678 9012 3456 7890",
            banco: "BBVA",
            accesoBanco: "Sí",
            estadoVPF: "Completado",
          },
        ],
      },
    ],
  },
  {
    id: "admin-003",
    nombre: "Ana Fernández Ruiz",
    email: "ana@gestionfernandez.es",
    comunidades: [
      {
        nombre: "Comunidad Villa Rosa",
        cif: "H-89012345",
        direccion: "C/ Rosa 7, 28006 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES77 0128 0001 5900 0123 4567",
            banco: "Bankinter",
            accesoBanco: "Sí",
            estadoVPF: "Pendiente",
          },
        ],
      },
      {
        nombre: "Residencial Moncloa",
        cif: "H-90123456",
        direccion: "Av. Moncloa 34, 28008 Madrid",
        activa: true,
        cuentas: [
          {
            iban: "ES09 0049 6785 4321 0987 6543",
            banco: "Santander",
            accesoBanco: "Sí",
            estadoVPF: "Completado",
          },
          {
            iban: "ES62 2100 9876 5432 1098 7654",
            banco: "CaixaBank",
            accesoBanco: "Pendiente",
            estadoVPF: "En trámite",
          },
        ],
      },
    ],
  },
];

export function getAdministradorByEmail(email: string): Administrador | undefined {
  return administradores.find(
    (admin) => admin.email.toLowerCase() === email.toLowerCase()
  );
}
