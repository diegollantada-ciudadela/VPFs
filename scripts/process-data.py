import json, sys

BANK_CODES = {
    "0049": "Santander",
    "0030": "Santander",
    "2100": "CaixaBank",
    "2101": "CaixaBank",
    "0182": "BBVA",
    "0081": "Sabadell",
    "2038": "Bankia",
    "0128": "Bankinter",
    "2310": "ING",
    "0075": "Banco Popular",
    "3190": "Caja Rural",
    "3191": "Caja Rural",
    "3192": "Caja Rural",
    "3059": "Cajamar",
    "2103": "Unicaja",
    "0019": "Deutsche Bank",
    "0073": "Openbank",
    "2085": "Ibercaja",
    "0065": "Barclays",
    "2080": "Abanca",
    "3058": "Cajamar",
    "2048": "Liberbank",
    "3081": "Caja Rural",
    "3001": "Caja Rural",
    "3007": "Caja Rural",
    "3017": "Caja Rural",
    "3023": "Caja Rural",
    "3029": "Caja Rural",
    "3035": "Caja Rural CLM",
    "3076": "Caja Rural",
    "3080": "Caja Rural",
    "3085": "Caja Rural",
    "3098": "Caja Rural",
    "3115": "Caja Rural",
    "3134": "Caja Rural",
    "3140": "Caja Rural",
    "3144": "Caja Rural",
    "3150": "Caja Rural",
    "3152": "Caja Rural",
    "3157": "Caja Rural",
    "3159": "Caja Rural",
    "3160": "Caja Rural",
    "3162": "Caja Rural",
    "3166": "Caja Rural",
    "3174": "Caja Rural",
    "3179": "Caja Rural",
    "3183": "Caja Rural",
    "3186": "Caja Rural",
    "3187": "Caja Rural",
    "3056": "Caja Rural",
    "3005": "Caja Rural",
    "0108": "Banca March",
    "2095": "Kutxabank",
    "2097": "Cajasur",
    "2090": "Unicaja",
    "0186": "Banco Mediolanum",
    "2096": "Caja Espana",
    "2105": "Targobank",
    "0168": "Bankinter",
}

def get_bank_from_iban(iban):
    if not iban or len(iban) < 8:
        return None
    code = iban[4:8]
    return BANK_CODES.get(code, f"Banco ({code})")

raw = json.load(sys.stdin)
data = json.loads(raw[0]["text"])
rows = data["data"]["rows"]

admins = {}
for r in rows:
    aid = r["admin_id"]
    if aid not in admins:
        admins[aid] = {
            "id": aid,
            "nombre": r["admin_name"],
            "comunidades": {}
        }
    cid = r["community_id"]
    if cid not in admins[aid]["comunidades"]:
        admins[aid]["comunidades"][cid] = {
            "id": cid,
            "nombre": r["community_name"],
            "cif": r["cif"],
            "direccion": r["direccion"] or "",
            "ibans": []
        }
    if r["iban"] and r["iban"] not in admins[aid]["comunidades"][cid]["ibans"]:
        admins[aid]["comunidades"][cid]["ibans"].append(r["iban"])

result = []
for aid in sorted(admins.keys(), key=lambda x: admins[x]["nombre"]):
    a = admins[aid]
    comms = []
    for cid in sorted(a["comunidades"].keys(), key=lambda x: a["comunidades"][x]["nombre"]):
        c = a["comunidades"][cid]
        cuentas = []
        for iban in c["ibans"]:
            banco = get_bank_from_iban(iban)
            formatted = " ".join([iban[i:i+4] for i in range(0, len(iban), 4)])
            cuentas.append({
                "iban": formatted,
                "banco": banco or "Desconocido",
            })
        comms.append({
            "nombre": c["nombre"],
            "cif": c["cif"],
            "direccion": c["direccion"],
            "cuentas": cuentas
        })
    result.append({
        "id": a["id"],
        "nombre": a["nombre"],
        "comunidades": comms
    })

json.dump(result, sys.stdout, ensure_ascii=False, indent=2)
