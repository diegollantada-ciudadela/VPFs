#!/usr/bin/env python3
"""
Parse the Google Sheet data and generate vpf-status.json
Input: the raw sheet data file (TSV)
Output: JSON mapping IBAN -> {banco, accesoBanco, estadoVPF}
"""
import json
import re
import sys

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
    return "Pendiente"

def normalize_estado(val):
    if not val:
        return "No iniciado"
    v = val.strip().lower()
    if "completada" in v or "tramitada" in v:
        return "Completado"
    if "proceso" in v or "progress" in v or "actualizando" in v:
        return "En trámite"
    if "relaunch" in v or "necesita" in v:
        return "Pendiente"
    if "rechazad" in v or "rejected" in v or "denegad" in v:
        return "Rechazado"
    # Various in-progress sub-states
    if v in ("banco", "documento", "firma", "dni", "acta", "varios",
             "altas", "discrepancia", "ciudadela"):
        return "En trámite"
    return "No iniciado"

# Raw data embedded - parsed from the Google Sheet paste
raw_rows = []
