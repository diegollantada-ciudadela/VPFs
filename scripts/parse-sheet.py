import json
import sys
import re

# Parse the tab-separated Google Sheet data from stdin
# Columns: Nombre CP, NIF, Admin, Estado CP, Cartera, Banco(G), IBAN(H), Usuario, Acceso Banco(J), Estado VPF(K), ...

def clean_iban(iban):
    if not iban:
        return ""
    return re.sub(r'[\s\-]', '', iban.strip()).upper()

def normalize_acceso(val):
    if not val:
        return "Pendiente"
    v = val.strip().lower()
    if v in ("sí", "si", "yes", "s"):
        return "Sí"
    if v in ("no", "n"):
        return "No"
    if v == "n/a":
        return "Pendiente"
    return "Pendiente"

def normalize_estado(val):
    if not val:
        return "No iniciado"
    v = val.strip().lower()
    if "completada" in v or "tramitada" in v:
        return "Completado"
    if "proceso" in v or "progress" in v:
        return "En trámite"
    if "pendiente" in v or "pending" in v:
        return "Pendiente"
    if "relaunch" in v or "necesita" in v:
        return "Pendiente"
    if "rechazad" in v or "rejected" in v or "denegad" in v:
        return "Rechazado"
    if "actualizando" in v:
        return "En trámite"
    if "banco" in v or "documento" in v or "firma" in v or "dni" in v or "acta" in v or "varios" in v or "altas" in v or "discrepancia" in v:
        return "En trámite"
    if "ciudadela" in v:
        return "En trámite"
    return "No iniciado"

result = {}
line_count = 0
skipped = 0

for line in sys.stdin:
    line_count += 1
    if line_count == 1:
        # Skip header
        continue

    parts = line.strip().split('\t')
    if len(parts) < 11:
        skipped += 1
        continue

    # Columns: 0=ID?, 1=Nombre, 2=NIF, 3=Admin, 4=Estado CP, 5=Cartera, 6=Banco, 7=IBAN, 8=Usuario, 9=Acceso Banco, 10=Estado VPF
    banco = parts[6].strip() if len(parts) > 6 else ""
    iban_raw = parts[7].strip() if len(parts) > 7 else ""
    acceso = parts[9].strip() if len(parts) > 9 else ""
    estado = parts[10].strip() if len(parts) > 10 else ""

    # Some rows have multiple IBANs separated by comma
    ibans = [i.strip() for i in iban_raw.split(',') if i.strip()]

    for iban in ibans:
        cleaned = clean_iban(iban)
        if not cleaned or len(cleaned) < 10:
            continue

        # Normalize banco name
        banco_clean = banco.strip()
        if banco_clean.lower() == "zer0":
            banco_clean = "zer0"

        result[cleaned] = {
            "banco": banco_clean,
            "accesoBanco": normalize_acceso(acceso),
            "estadoVPF": normalize_estado(estado),
        }

print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stdout)
print(f"Processed {line_count} lines, {len(result)} unique IBANs, skipped {skipped}", file=sys.stderr)
