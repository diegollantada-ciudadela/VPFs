/**
 * Cliente GraphQL para la API de Ciudadela (Strapi)
 *
 * Para activar la conexión en tiempo real:
 * 1. Configurar CIUDADELA_API_URL en .env.local (ej: https://api.ciudadela.eu/graphql)
 * 2. Configurar CIUDADELA_API_TOKEN en .env.local (API token de Strapi)
 * 3. Cambiar el import en data.ts de ciudadela-data.json a este cliente
 */

const API_URL = process.env.CIUDADELA_API_URL || "";
const API_TOKEN = process.env.CIUDADELA_API_TOKEN || "";

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function graphqlQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!API_URL || !API_TOKEN) {
    throw new Error(
      "Ciudadela GraphQL no configurado. Configura CIUDADELA_API_URL y CIUDADELA_API_TOKEN en .env.local"
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 }, // Cache 5 minutos
  });

  if (!res.ok) {
    throw new Error(`Ciudadela API error: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(
      `Ciudadela GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data;
}

// Query para obtener administradores con sus comunidades activas
const ADMIN_WITH_COMMUNITIES_QUERY = `
  query GetAdministrator($id: ID!) {
    administrator(id: $id) {
      data {
        id
        attributes {
          name
          email
          communities(filters: { status: { eq: "active" } }, pagination: { limit: -1 }) {
            data {
              id
              attributes {
                name
                cif
                address {
                  address
                  city
                  zip_code
                }
                ibans {
                  iban
                }
              }
            }
          }
        }
      }
    }
  }
`;

const SEARCH_ADMINS_QUERY = `
  query SearchAdministrators($name: String!) {
    administrators(
      filters: { name: { containsi: $name } }
      pagination: { limit: 20 }
      sort: "name:asc"
    ) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

// Funciones públicas para usar cuando se configure la API
export async function fetchAdminById(id: number) {
  const data = await graphqlQuery<{
    administrator: {
      data: {
        id: string;
        attributes: {
          name: string;
          communities: {
            data: Array<{
              attributes: {
                name: string;
                cif: string;
                address: { address: string; city: string; zip_code: string };
                ibans: Array<{ iban: string }>;
              };
            }>;
          };
        };
      };
    };
  }>(ADMIN_WITH_COMMUNITIES_QUERY, { id });

  return data.administrator.data;
}

export async function fetchAdminSearch(name: string) {
  const data = await graphqlQuery<{
    administrators: {
      data: Array<{
        id: string;
        attributes: { name: string };
      }>;
    };
  }>(SEARCH_ADMINS_QUERY, { name });

  return data.administrators.data;
}

export function isGraphQLConfigured(): boolean {
  return Boolean(API_URL && API_TOKEN);
}
