import { NextRequest, NextResponse } from "next/server";
import { getAdministradorById, searchAdministradores } from "@/lib/data";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const search = request.nextUrl.searchParams.get("search");

  // Search admins by name
  if (search !== null) {
    const results = searchAdministradores(search);
    return NextResponse.json(results);
  }

  // Get admin by ID
  if (!id) {
    return NextResponse.json(
      { error: "Parámetro 'id' o 'search' requerido" },
      { status: 400 }
    );
  }

  const admin = getAdministradorById(Number(id));

  if (!admin) {
    return NextResponse.json(
      { error: "Administrador no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(admin);
}
