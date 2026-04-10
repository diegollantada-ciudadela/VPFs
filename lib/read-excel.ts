import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { AccesoBanco, EstadoVPF } from "./types";

/**
 * Lee el archivo Excel del Google Sheet desde data/vpf-data.xlsx
 * Columnas esperadas:
 *   G = Banco
 *   H = IBAN
 *   J = Acceso Banco
 *   K = Estado VPF
 */

interface SheetRow {
  banco: string;
  iban: string;
  accesoBanco: AccesoBanco;
  estadoVPF: EstadoVPF;
}

function normalizeAcceso(value: string | undefined | null): AccesoBanco {
  if (!value) return "Pendiente";
  const v = value.toString().trim().toLowerCase();
  if (v === "sí" || v === "si" || v === "yes" || v === "s") return "Sí";
  if (v === "no" || v === "n") return "No";
  return "Pendiente";
}

function normalizeEstado(value: string | undefined | null): EstadoVPF {
  if (!value) return "No iniciado";
  const v = value.toString().trim().toLowerCase();
  if (v.includes("completado") || v.includes("hecho") || v.includes("done"))
    return "Completado";
  if (v.includes("trámite") || v.includes("tramite") || v.includes("proceso") || v.includes("progress"))
    return "En trámite";
  if (v.includes("pendiente") || v.includes("pending"))
    return "Pendiente";
  if (v.includes("rechazado") || v.includes("rejected") || v.includes("denegado"))
    return "Rechazado";
  return "No iniciado";
}

function cleanIban(iban: string | undefined | null): string {
  if (!iban) return "";
  return iban.toString().replace(/[\s\-]/g, "").toUpperCase();
}

export function readVpfExcel(): Map<string, SheetRow> {
  const result = new Map<string, SheetRow>();

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) return result;

  // Buscar cualquier .xlsx o .csv en la carpeta data/
  const files = fs.readdirSync(dataDir);
  const excelFile = files.find(
    (f) => f.endsWith(".xlsx") || f.endsWith(".xls") || f.endsWith(".csv")
  );

  if (!excelFile) return result;

  const filePath = path.join(dataDir, excelFile);
  const workbook = XLSX.readFile(filePath);

  // Usar la primera hoja o la que coincida con el gid
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) return result;

  // Convertir a JSON con headers de columna
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
  });

  for (const row of rows) {
    // Intentar encontrar las columnas por nombre o por posición (G, H, J, K)
    const banco =
      row["Banco"] || row["banco"] || row["BANCO"] || "";
    const iban =
      row["IBAN"] || row["iban"] || row["Iban"] || "";
    const acceso =
      row["Acceso Banco"] ||
      row["acceso_banco"] ||
      row["Acceso banco"] ||
      row["ACCESO BANCO"] ||
      "";
    const estado =
      row["Estado VPF"] ||
      row["estado_vpf"] ||
      row["Estado vpf"] ||
      row["ESTADO VPF"] ||
      "";

    const cleanedIban = cleanIban(iban);
    if (!cleanedIban) continue;

    result.set(cleanedIban, {
      banco: banco.toString().trim(),
      iban: cleanedIban,
      accesoBanco: normalizeAcceso(acceso),
      estadoVPF: normalizeEstado(estado),
    });
  }

  return result;
}
