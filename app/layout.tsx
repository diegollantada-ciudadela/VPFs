import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VPFs - Gestión de Autorizados",
  description: "Plataforma de gestión de variación de personas firmantes para administradores de fincas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
