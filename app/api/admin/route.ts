import { NextRequest, NextResponse } from "next/server";
import { getAdministradorByEmail } from "@/lib/data";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email requerido" },
      { status: 400 }
    );
  }

  const admin = getAdministradorByEmail(email);

  if (!admin) {
    return NextResponse.json(
      { error: "Administrador no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(admin);
}
