#!/usr/bin/env python3
"""Generate a standalone HTML app with login + dashboard, all data embedded."""
import json, sys

with open('/tmp/all-admins-data.json') as f:
    all_data = json.load(f)

admin_list = [{"id": v["id"], "nombre": v["nombre"]} for v in all_data.values()]
admin_list.sort(key=lambda x: x["nombre"])

print("""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VPFs - Gestion de Autorizados</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b;min-height:100vh}
.header{background:#fff;border-bottom:1px solid #e2e8f0;padding:0 24px;position:sticky;top:0;z-index:40}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:18px;cursor:pointer}
.logo-icon{width:32px;height:32px;background:#1e40af;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:14px}
.user-info{display:flex;align-items:center;gap:12px;color:#94a3b8;font-size:14px}
.btn-logout{color:#94a3b8;cursor:pointer;background:none;border:none;font-size:14px}
.btn-logout:hover{color:#1e293b}
.login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}
.login-card{width:100%;max-width:420px}
.login-header{text-align:center;margin-bottom:32px}
.login-icon{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:16px;background:#1e40af;margin-bottom:16px;color:white;font-size:28px}
.login-header h1{font-size:24px;font-weight:700}
.login-header p{color:#94a3b8;margin-top:8px}
.card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);border:1px solid #e2e8f0;padding:32px}
.card h2{font-size:18px;font-weight:600;margin-bottom:4px}
.card .sub{font-size:14px;color:#94a3b8;margin-bottom:24px}
label{display:block;font-size:14px;font-weight:500;margin-bottom:8px}
input[type=text]{width:100%;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;font-size:15px;outline:none;background:#f8fafc}
input[type=text]:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.15)}
.dropdown{position:absolute;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);max-height:240px;overflow-y:auto;z-index:50;margin-top:4px}
.dropdown-item{padding:12px 16px;cursor:pointer;font-size:14px;border-bottom:1px solid #f1f5f9}
.dropdown-item:hover{background:#eff6ff}
.dropdown-item:last-child{border-bottom:none}
.selected-badge{margin:16px 0;padding:12px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;font-size:14px;display:flex;align-items:center;gap:8px}
.btn-primary{width:100%;padding:12px;border-radius:8px;background:#1e40af;color:white;font-size:15px;font-weight:500;border:none;cursor:pointer}
.btn-primary:hover{background:#1e3a8a}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed}
.main{max-width:1200px;margin:0 auto;padding:32px 24px}
.welcome h1{font-size:24px;font-weight:700;margin-bottom:4px}
.welcome p{color:#94a3b8;margin-bottom:24px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.stat{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px}
.stat-value{font-size:28px;font-weight:700}
.green{color:#16a34a}.blue{color:#2563eb}.amber{color:#f59e0b}
.stat-label{font-size:13px;color:#94a3b8;margin-top:2px}
.stat-sub{font-size:14px;font-weight:400;color:#94a3b8}
.community{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px}
.community-header{padding:16px 24px;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px}
.community-name{font-weight:600;font-size:15px}
.community-meta{display:flex;gap:16px;margin-top:4px;flex-wrap:wrap}
.community-meta span{font-size:12px;color:#94a3b8}
.mono{font-family:monospace}
.badge-active{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;background:#dcfce7;color:#16a34a;font-size:12px;font-weight:500}
.badge-active .dot{width:6px;height:6px;border-radius:50%;background:#16a34a}
table{width:100%;font-size:14px;border-collapse:collapse}
thead{text-transform:uppercase;font-size:11px;color:#94a3b8;letter-spacing:0.05em}
th{padding:10px 24px;text-align:left;font-weight:500}
td{padding:12px 24px;border-top:1px solid #e2e8f0}
tr:hover{background:#fafafa}
.banco-cell{display:flex;align-items:center;gap:10px}
.banco-logo{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;flex-shrink:0}
.iban{font-family:monospace;font-size:12px;color:#475569}
.acceso{display:inline-flex;align-items:center;gap:4px;font-size:13px}
.acceso-si{color:#16a34a}.acceso-no{color:#dc2626}.acceso-pend{color:#f59e0b}
.estado{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid}
.estado-completado{background:#dcfce7;color:#16a34a;border-color:#bbf7d0}
.estado-en-tramite{background:#dbeafe;color:#2563eb;border-color:#bfdbfe}
.estado-pendiente{background:#fef3c7;color:#f59e0b;border-color:#fde68a}
.estado-no-iniciado{background:#f1f5f9;color:#64748b;border-color:#e2e8f0}
.btn-tramitar{padding:6px 14px;font-size:12px;font-weight:500;border-radius:8px;border:none;cursor:pointer}
.btn-tramitar-primary{background:#1e40af;color:white}
.btn-tramitar-primary:hover{background:#1e3a8a}
.btn-tramitar-done{color:#94a3b8;font-style:italic;background:none;cursor:default}
.text-right{text-align:right}
.hidden{display:none}
@media(max-width:768px){.stats{grid-template-columns:repeat(2,1fr)}.community-header{flex-direction:column}table{font-size:12px}th,td{padding:8px 12px}}
</style>
</head>
<body>

<div id="login-view" class="login-page">
<div class="login-card">
<div class="login-header">
<div class="login-icon">&#9899;</div>
<h1>Gestion de Autorizados</h1>
<p>Plataforma VPF para administradores de fincas</p>
</div>
<div class="card">
<h2>Acceder al panel</h2>
<p class="sub">Busca tu nombre para acceder a tus comunidades.</p>
<div style="position:relative">
<label for="search">Administrador</label>
<input type="text" id="search" placeholder="Escribe tu nombre..." autocomplete="off">
<div id="dropdown" class="dropdown hidden"></div>
</div>
<div id="selected" class="selected-badge hidden"></div>
<button id="btn-enter" class="btn-primary" disabled onclick="enterDashboard()">Acceder</button>
</div>
</div>
</div>

<div id="dashboard-view" class="hidden">
<div class="header"><div class="header-inner">
<div class="logo" onclick="goBack()"><div class="logo-icon">&#9899;</div> VPFs</div>
<div class="user-info"><span id="dash-user"></span><button class="btn-logout" onclick="goBack()">Salir</button></div>
</div></div>
<div class="main" id="dash-content"></div>
</div>

<script>
""")

print("const ADMINS = " + json.dumps(admin_list, ensure_ascii=False) + ";")
print("const DATA = " + json.dumps(all_data, ensure_ascii=False) + ";")

print("""
let selectedAdmin = null;
const searchEl = document.getElementById('search');
const dropdownEl = document.getElementById('dropdown');
const selectedEl = document.getElementById('selected');
const btnEl = document.getElementById('btn-enter');

searchEl.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  selectedAdmin = null;
  selectedEl.classList.add('hidden');
  btnEl.disabled = true;
  if (q.length < 2) { dropdownEl.classList.add('hidden'); return; }
  const matches = ADMINS.filter(a => a.nombre.toLowerCase().includes(q)).slice(0, 10);
  if (matches.length === 0) { dropdownEl.classList.add('hidden'); return; }
  dropdownEl.innerHTML = matches.map(a =>
    '<div class="dropdown-item" onclick="selectAdmin(' + a.id + ',\\'' + a.nombre.replace(/'/g,"\\\\'") + '\\')">' + a.nombre + '</div>'
  ).join('');
  dropdownEl.classList.remove('hidden');
});

searchEl.addEventListener('focus', function() {
  if (this.value.length >= 2) this.dispatchEvent(new Event('input'));
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('#search') && !e.target.closest('#dropdown')) dropdownEl.classList.add('hidden');
});

function selectAdmin(id, name) {
  selectedAdmin = {id, nombre: name};
  searchEl.value = name;
  dropdownEl.classList.add('hidden');
  selectedEl.innerHTML = '&#10004; ' + name;
  selectedEl.classList.remove('hidden');
  btnEl.disabled = false;
}

function bancoColor(b) {
  const l = b.toLowerCase();
  if (l.includes('sabadell')) return '#dc2626';
  if (l.includes('caixa') && !l.includes('guissona') && !l.includes('popular')) return '#0284c7';
  if (l.includes('bbva')) return '#1d4ed8';
  if (l.includes('bankinter')) return '#ea580c';
  if (l.includes('ibercaja')) return '#7c3aed';
  if (l.includes('cajamar')) return '#059669';
  if (l.includes('santander')) return '#dc2626';
  if (l.includes('unicaja')) return '#4f46e5';
  if (l.includes('globalcaja') || l.includes('caja rural') || l.includes('eurocaja')) return '#16a34a';
  return '#6b7280';
}

function bancoInitials(b) { return b.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); }

function estadoClass(e) {
  if (e==='Completado') return 'estado-completado';
  if (e==='En tramite'||e==='En trámite') return 'estado-en-tramite';
  if (e==='Pendiente') return 'estado-pendiente';
  return 'estado-no-iniciado';
}

function accesoClass(a) {
  if (a==='Si'||a==='Sí') return 'acceso-si';
  if (a==='No') return 'acceso-no';
  return 'acceso-pend';
}

function enterDashboard() {
  if (!selectedAdmin) return;
  const admin = DATA[selectedAdmin.id];
  if (!admin) { alert('Admin no encontrado'); return; }
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');
  document.getElementById('dash-user').textContent = admin.nombre;

  const tc = admin.comunidades.reduce((a,c) => a + c.cuentas.length, 0);
  const comp = admin.comunidades.reduce((a,c) => a + c.cuentas.filter(ct=>ct.estadoVPF==='Completado').length, 0);
  const tram = admin.comunidades.reduce((a,c) => a + c.cuentas.filter(ct=>ct.estadoVPF==='En trámite').length, 0);
  const pend = tc - comp - tram;

  let html = '<div class="welcome"><h1>Hola, ' + admin.nombre.split(' ')[0] + '</h1><p>Gestiona los cambios de autorizados de tus comunidades</p></div>';
  html += '<div class="stats">';
  html += '<div class="stat"><div class="stat-value">' + admin.comunidades.length + '</div><div class="stat-label">Comunidades</div></div>';
  html += '<div class="stat"><div class="stat-value green">' + comp + '<span class="stat-sub">/' + tc + '</span></div><div class="stat-label">VPFs completados</div></div>';
  html += '<div class="stat"><div class="stat-value blue">' + tram + '</div><div class="stat-label">En tramite</div></div>';
  html += '<div class="stat"><div class="stat-value amber">' + pend + '</div><div class="stat-label">Pendientes</div></div>';
  html += '</div>';

  admin.comunidades.forEach(c => {
    html += '<div class="community"><div class="community-header"><div><div class="community-name">' + c.nombre + '</div>';
    html += '<div class="community-meta"><span>CIF: <span class="mono">' + c.cif + '</span></span><span>' + c.direccion + '</span></div></div>';
    html += '<span class="badge-active"><span class="dot"></span>Activa</span></div>';
    if (c.cuentas.length > 0) {
      html += '<table><thead><tr><th>Banco</th><th>IBAN</th><th>Acceso</th><th>Estado VPF</th><th class="text-right">Accion</th></tr></thead><tbody>';
      c.cuentas.forEach(ct => {
        const color = bancoColor(ct.banco);
        const initials = bancoInitials(ct.banco);
        const ec = estadoClass(ct.estadoVPF);
        const ac = accesoClass(ct.accesoBanco);
        let btn = ct.estadoVPF === 'Completado'
          ? '<span class="btn-tramitar btn-tramitar-done">Completado</span>'
          : '<button class="btn-tramitar btn-tramitar-primary">Tramitar VPF</button>';
        html += '<tr><td><div class="banco-cell"><span class="banco-logo" style="background:' + color + '">' + initials + '</span>' + ct.banco + '</div></td>';
        html += '<td><span class="iban">' + ct.iban + '</span></td>';
        html += '<td><span class="acceso ' + ac + '">' + ct.accesoBanco + '</span></td>';
        html += '<td><span class="estado ' + ec + '">' + ct.estadoVPF + '</span></td>';
        html += '<td class="text-right">' + btn + '</td></tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<div style="padding:16px 24px;color:#94a3b8;font-size:14px">Sin cuentas bancarias registradas</div>';
    }
    html += '</div>';
  });

  document.getElementById('dash-content').innerHTML = html;
  window.scrollTo(0,0);
}

function goBack() {
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('login-view').classList.remove('hidden');
  selectedAdmin = null;
  searchEl.value = '';
  selectedEl.classList.add('hidden');
  btnEl.disabled = true;
}
</script>
</body></html>""")
