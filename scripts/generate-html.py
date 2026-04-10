#!/usr/bin/env python3
import json, sys

data = json.load(sys.stdin)
admin = data

total_cuentas = sum(len(c['cuentas']) for c in admin['comunidades'])
completados = sum(1 for c in admin['comunidades'] for ct in c['cuentas'] if ct['estadoVPF'] == 'Completado')
en_tramite = sum(1 for c in admin['comunidades'] for ct in c['cuentas'] if ct['estadoVPF'] == 'En trámite')
pendientes = total_cuentas - completados - en_tramite

def banco_class(banco):
    b = banco.lower()
    if 'sabadell' in b: return 'sabadell'
    if 'caixa' in b and 'guissona' not in b: return 'caixabank'
    if 'bbva' in b: return 'bbva'
    if 'bankinter' in b: return 'bankinter'
    if 'ibercaja' in b: return 'ibercaja'
    if 'cajamar' in b: return 'cajamar'
    return 'other'

def banco_initials(banco):
    return ''.join(w[0] for w in banco.split()[:2]).upper()

def estado_class(estado):
    if estado == 'Completado': return 'completado'
    if estado == 'En tramite': return 'en-tramite'
    if estado == 'Pendiente': return 'pendiente'
    return 'no-iniciado'

def acceso_icon(acceso):
    if acceso == 'Si': return '&#10004;'
    if acceso == 'No': return '&#10008;'
    return '&#9201;'

def acceso_class(acceso):
    if acceso == 'Si': return 'si'
    if acceso == 'No': return 'no'
    return 'pend'

rows = ""
for c in admin['comunidades'][:20]:
    rows += f"""<div class="community">
<div class="community-header">
<div><div class="community-name">{c['nombre']}</div>
<div class="community-meta"><span>CIF: <span class="mono">{c['cif']}</span></span><span>{c['direccion']}</span></div></div>
<span class="badge-active"><span class="dot"></span>Activa</span>
</div>
<table><thead><tr><th>Banco</th><th>IBAN</th><th>Acceso Banco</th><th>Estado VPF</th><th class="text-right">Accion</th></tr></thead><tbody>"""
    for ct in c['cuentas']:
        bc = banco_class(ct['banco'])
        bi = banco_initials(ct['banco'])
        ec = estado_class(ct['estadoVPF'])
        ac = acceso_class(ct['accesoBanco'])
        ai = acceso_icon(ct['accesoBanco'])
        if ct['estadoVPF'] == 'Completado':
            btn = '<span class="btn-tramitar done">Completado</span>'
        elif ct['estadoVPF'] == 'En tramite':
            btn = '<button class="btn-tramitar secondary">Ver estado</button>'
        else:
            btn = '<button class="btn-tramitar primary">Tramitar VPF</button>'
        rows += f"""<tr>
<td><div class="banco-cell"><span class="banco-logo {bc}">{bi}</span>{ct['banco']}</div></td>
<td><span class="iban">{ct['iban']}</span></td>
<td><span class="acceso {ac}">{ai} {ct['accesoBanco']}</span></td>
<td><span class="estado {ec}">{ct['estadoVPF']}</span></td>
<td class="text-right">{btn}</td>
</tr>"""
    rows += "</tbody></table></div>"

if len(admin['comunidades']) > 20:
    rows += f'<p style="text-align:center;color:#94a3b8;padding:20px;">... y {len(admin["comunidades"])-20} comunidades mas</p>'

print(f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VPFs - Gestion de Autorizados</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b}}
.header{{background:#fff;border-bottom:1px solid #e2e8f0;padding:0 24px;position:sticky;top:0;z-index:40}}
.header-inner{{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px}}
.logo{{display:flex;align-items:center;gap:10px;font-weight:600;font-size:18px}}
.logo-icon{{width:32px;height:32px;background:#1e40af;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:16px}}
.user-info{{color:#94a3b8;font-size:14px}}
.main{{max-width:1200px;margin:0 auto;padding:32px 24px}}
.welcome h1{{font-size:24px;font-weight:700;margin-bottom:4px}}
.welcome p{{color:#94a3b8;margin-bottom:24px}}
.stats{{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}}
.stat{{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px}}
.stat-value{{font-size:28px;font-weight:700}}
.stat-value.green{{color:#16a34a}}
.stat-value.blue{{color:#2563eb}}
.stat-value.amber{{color:#f59e0b}}
.stat-label{{font-size:13px;color:#94a3b8;margin-top:2px}}
.stat-sub{{font-size:14px;font-weight:400;color:#94a3b8}}
.community{{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px}}
.community-header{{padding:16px 24px;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px}}
.community-name{{font-weight:600;font-size:15px}}
.community-meta{{display:flex;gap:16px;margin-top:4px;flex-wrap:wrap}}
.community-meta span{{font-size:12px;color:#94a3b8}}
.mono{{font-family:monospace}}
.badge-active{{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;background:#dcfce7;color:#16a34a;font-size:12px;font-weight:500}}
.badge-active .dot{{width:6px;height:6px;border-radius:50%;background:#16a34a}}
table{{width:100%;font-size:14px;border-collapse:collapse}}
thead{{text-transform:uppercase;font-size:11px;color:#94a3b8;letter-spacing:0.05em}}
th{{padding:10px 24px;text-align:left;font-weight:500}}
td{{padding:12px 24px;border-top:1px solid #e2e8f0}}
tr:hover{{background:#fafafa}}
.banco-cell{{display:flex;align-items:center;gap:10px}}
.banco-logo{{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;flex-shrink:0}}
.banco-logo.sabadell{{background:#dc2626}}
.banco-logo.caixabank{{background:#0284c7}}
.banco-logo.bbva{{background:#1d4ed8}}
.banco-logo.bankinter{{background:#ea580c}}
.banco-logo.ibercaja{{background:#7c3aed}}
.banco-logo.cajamar{{background:#059669}}
.banco-logo.other{{background:#6b7280}}
.iban{{font-family:monospace;font-size:12px;color:#475569}}
.acceso{{display:inline-flex;align-items:center;gap:4px;font-size:13px}}
.acceso.si{{color:#16a34a}}
.acceso.no{{color:#dc2626}}
.acceso.pend{{color:#f59e0b}}
.estado{{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid}}
.estado.completado{{background:#dcfce7;color:#16a34a;border-color:#bbf7d0}}
.estado.en-tramite{{background:#dbeafe;color:#2563eb;border-color:#bfdbfe}}
.estado.pendiente{{background:#fef3c7;color:#f59e0b;border-color:#fde68a}}
.estado.no-iniciado{{background:#f1f5f9;color:#64748b;border-color:#e2e8f0}}
.btn-tramitar{{padding:6px 14px;font-size:12px;font-weight:500;border-radius:8px;border:none;cursor:pointer}}
.btn-tramitar.primary{{background:#1e40af;color:white}}
.btn-tramitar.primary:hover{{background:#1e3a8a}}
.btn-tramitar.secondary{{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}}
.btn-tramitar.done{{color:#94a3b8;font-style:italic;background:none;cursor:default}}
.text-right{{text-align:right}}
@media(max-width:768px){{.stats{{grid-template-columns:repeat(2,1fr)}}.community-header{{flex-direction:column}}table{{font-size:12px}}th,td{{padding:8px 12px}}}}
</style>
</head>
<body>
<div class="header"><div class="header-inner">
<div class="logo"><div class="logo-icon">&#9899;</div> VPFs</div>
<div class="user-info">{admin['nombre']}</div>
</div></div>
<div class="main">
<div class="welcome"><h1>Hola, {admin['nombre'].split(' ')[0]}</h1><p>Gestiona los cambios de autorizados de tus comunidades</p></div>
<div class="stats">
<div class="stat"><div class="stat-value">{len(admin['comunidades'])}</div><div class="stat-label">Comunidades</div></div>
<div class="stat"><div class="stat-value green">{completados}<span class="stat-sub">/{total_cuentas}</span></div><div class="stat-label">VPFs completados</div></div>
<div class="stat"><div class="stat-value blue">{en_tramite}</div><div class="stat-label">En tramite</div></div>
<div class="stat"><div class="stat-value amber">{pendientes}</div><div class="stat-label">Pendientes</div></div>
</div>
{rows}
</div>
</body></html>""")
