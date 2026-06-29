// @ts-nocheck
/* eslint-disable */
/**
 * Marketing United — módulo "roadmap2030".
 * Controlador autónomo: inyecta su layout (sidebar + top bar + vistas) en ROOT
 * y ejecuta su motor reactivo (estado, cálculos y render). Todo el manejo de
 * eventos está delegado a ROOT, así cada módulo es independiente.
 * Powered by AXON B2B.
 */
const BODY = `<div class="app">
  <aside class="side">
    <div class="brand">
      <div class="chip brandchip"></div>
      <div class="wm"><b>Marketing United</b><span>Rumbo al 2030</span></div>
    </div>
    <div class="navlbl">Estrategia</div>
    <nav class="nav">
      <a data-v="resumen" class="on"><span class="ic" data-i="flag"></span>Rumbo 2030</a>
      <a data-v="portafolio"><span class="ic" data-i="grid"></span>Portafolio</a>
    </nav>
    <div class="navlbl">Motor del negocio</div>
    <nav class="nav">
      <a data-v="financiero"><span class="ic" data-i="coin"></span>Modelo financiero</a>
      <a data-v="comercial"><span class="ic" data-i="users"></span>Modelo comercial</a>
      <a data-v="operativo"><span class="ic" data-i="flow"></span>Modelo operativo</a>
    </nav>
    <div class="navlbl">Capacidades</div>
    <nav class="nav">
      <a data-v="talento"><span class="ic" data-i="people"></span>Talento</a>
      <a data-v="tecnologia"><span class="ic" data-i="chip"></span>Tecnología · IA</a>
      <a data-v="roadmap" class="road90"><span class="ic" data-i="flag"></span>Roadmap 90 días</a>
    </nav>
    <div class="foot">
      <div class="pw">Powered by AXON B2B</div>
    </div>
  </aside>
  <div class="main">
    <header class="top">
      <button class="menubtn" aria-label="Menú"><span class="ic" data-i="flag" style="color:var(--ink)"></span></button>
      <div><h1 class="vtitle">Rumbo 2030</h1><div class="sub vsub">Plan estratégico · Marketing United</div></div>
      <div class="spacer"></div>
      <button class="resetbtn">↺ Restablecer</button>
      <div class="pill">Actual → 2030</div>
    </header>
    <div class="views"></div>
  </div>
</div>`;

export function createRoadmap2030(ROOT: HTMLElement): () => void {
  ROOT.innerHTML = BODY;

/* ================= STATE ================= */
const YEARS=['Actual','2026','2027','2028','2029','2030'];
const DEFAULTS={
 fin:{
  ventas:[492.8,520,600,700,810,950],
  margen:[0.375,0.39,0.40,0.41,0.42,0.44],
  utilEsp:[0.17,0.17,0.18,0.18,0.19,0.20],
  presup:[82,86,98,112,128,145],
 },
 caja:{cobranza:60,pago:45,cajaMin:20},
 mix:[
  {f:'Grupo Salinas',a:56,o:35,dec:'Reducir dependencia'},
  {f:'Clientes externos',a:28,o:40,dec:'Crecer'},
  {f:'Proyectos a la medida',a:10,o:15,dec:'Controlar'},
  {f:'Productos / servicios repetibles',a:6,o:10,dec:'Escalar'},
 ],
 uen:[
  {name:'TRADE',dec:'Crecer',rol:'Motor estrella',just:'Rentabilidad 45.6%: la unidad más sana del portafolio.'},
  {name:'BTL / ACTIVACIONES',dec:'Crecer',rol:'Motor principal',just:'Mayor aporte absoluto ($15.5 MDP): concentrar capacidad.'},
  {name:'EXPOS / STANDS',dec:'Crecer',rol:'Motor',just:'Rentabilidad 33.6% con ticket alto.'},
  {name:'EVENTOS',dec:'Crecer',rol:'Motor',just:'Rentabilidad 29.7% y recompra sólida.'},
  {name:'DIGITAL',dec:'Rediseñar',rol:'Escalar con margen',just:'11.4%: subir precio y automatizar para escalar rentable.'},
  {name:'PROMOCIONALES / MERCH',dec:'Rediseñar',rol:'Estandarizar',just:'13.8% con carga de gasto propio: estandarizar costeo.'},
  {name:'POP / IMPRESOS',dec:'Rediseñar',rol:'Controlar volumen',just:'9.1%: diluye margen, limitar a lo rentable.'},
  {name:'FULLFILMENT',dec:'Eliminar',rol:'Reestructurar o salir',just:'Rentabilidad −32.8%: drena margen del negocio.'},
  {name:'SERVICIOS / IGUALAS',dec:'Crecer',rol:'Ingreso recurrente',just:'Base repetible y escalable: financia el crecimiento.'},
 ],
 // unit economics objetivo 2030
 ue:[
  {name:'EVENTOS',v:95,m:0.48,g:8},{name:'BTL / ACTIVACIONES',v:180,m:0.42,g:12},
  {name:'EXPOS / STANDS',v:110,m:0.45,g:9},{name:'DIGITAL',v:90,m:0.50,g:7},
  {name:'POP / IMPRESOS',v:60,m:0.28,g:6},{name:'PROMOCIONALES / MERCH',v:80,m:0.30,g:7},
  {name:'FULLFILMENT',v:40,m:0.35,g:5},{name:'TRADE',v:210,m:0.50,g:14},{name:'SERVICIOS / IGUALAS',v:85,m:0.55,g:6},
 ],
 talento:[ // capacidad: nivel actual / requerido (1-5) -> brecha auto
  {cap:'Venta consultiva por Servicio',act:2,req:4,accion:'Capacitar / contratar / redefinir rol'},
  {cap:'Costeo, margen y pricing',act:2,req:5,accion:'Estandarizar / entrenar / controlar'},
  {cap:'Project management',act:2,req:4,accion:'Certificar / asignar PM / usar gates'},
  {cap:'Data, IA y automatización',act:1,req:4,accion:'Formar champions / automatizar tareas'},
  {cap:'Liderazgo de Servicio',act:2,req:4,accion:'Desarrollar / mover / reemplazar'},
 ],
 auto:[ // automatizaciones prioritarias
  {act:'Calificación de leads',a:'Scoring por fit, ticket, margen y probabilidad',imp:'Menos propuestas inútiles',on:false},
  {act:'Brief',a:'Formulario estándar + validación automática',imp:'Menos retrabajo',on:true},
  {act:'Cotización',a:'Calculadora por Servicio con margen mínimo',imp:'Mejor control de rentabilidad',on:true},
  {act:'Propuestas',a:'Plantillas por solución / Servicio',imp:'Mayor velocidad comercial',on:false},
  {act:'Seguimiento operativo',a:'Alertas de gates, fechas y pendientes',imp:'Menos desviaciones',on:false},
  {act:'Cierre financiero',a:'Comparación margen esperado vs real',imp:'Aprendizaje por proyecto',on:false},
  {act:'Satisfacción',a:'Encuesta de satisfacción + analíticas',imp:'Señal temprana de fuga',on:true},
 ],
 // tablas cualitativas editables (texto inicial sugerido, persisten en sesión)
 gates:[
  ['Lead','Account Owner','Lead aceptado o rechazado','% leads calificados'],
  ['Brief','Account + PM','Brief completo','% briefs completos'],
  ['Propuesta','Cotización + Servicio','Propuesta rentable','Margen esperado'],
  ['Cierre','Account + Finanzas','Proyecto autorizado','% anticipo recibido'],
  ['Producción','Servicio responsable','Listo para ejecutar','Retrabajos'],
  ['Ejecución','PM + Operación','Entrega sin desviaciones','Q / t / $'],
  ['Medición','PM + Data','Cierre financiero-operativo','Margen real'],
  ['Recompra','Account Owner','Nueva oportunidad','Tasa de recompra'],
 ],
 roles:[
  ['Account Owner','Relación, venta, expansión y retención del cliente','Ventas, recompra, concentración, LTV'],
  ['Líder Servicio','Margen, capacidad, calidad y especialización de la unidad','EBITDA Servicio, margen, utilización HH'],
  ['Project Manager','Gates, tiempos, entregables, desviaciones Q/t/$','Retrabajos, desviaciones, cumplimiento'],
  ['Especialista / Producción','Ejecución técnica y estandarización operativa','Productividad HH, calidad, retrabajo'],
  ['Finanzas comercial','Costeo, pricing, margen mínimo y rentabilidad por proyecto','Margen proyecto, punto de equilibrio'],
  ['Data / IA Ops','Automatización, dashboards y mejora de procesos','Horas ahorradas, adopción, eficiencia'],
 ],
 prod:[
  ['Revenue / empleado Servicio','Ventas Servicio / empleados','Productividad comercial por Servicio'],
  ['Gross profit / empleado','Utilidad bruta Servicio / empleados','Productividad real, no solo ventas'],
  ['Utilización HH','HH vendidas / HH disponibles','Detectar sobrecarga u ociosidad'],
  ['Utilización HH$','HH$ vendidas / HH$ disponibles','Monetización de capacidad'],
 ],
 // Tecnología IA · plan de trabajo en checklist por grupos (done/fecha/resp/nec por ítem)
 tech:[
  {g:'Principio operativo',items:[
   {label:'Herramientas sueltas → Sistema integrado por Servicio'},
   {label:'Reportes manuales → Dashboards vivos'},
   {label:'IA como experimento → IA aplicada a procesos con impacto en Q / t / $'},
   {label:'Datos dispersos → Data accionable para decidir'},
  ]},
  {g:'Dashboards críticos',items:[
   {label:'CEO — Ventas, EBITDA, margen por Servicio, caja, riesgos'},
   {label:'Servicio — Ventas, margen, capacidad, calidad, recompra'},
   {label:'Comercial — Pipeline, conversión, CAC, LTV, concentración'},
   {label:'Finanzas — Margen esperado vs real, CCC, punto de equilibrio'},
  ]},
  {g:'Procesos a digitalizar',items:[
   {label:'Comercial — Pipeline disperso → CRM único por cliente, Servicio, etapa, ticket y margen'},
   {label:'Brief — Información incompleta → Brief digital con campos obligatorios y gate de avance'},
   {label:'Cotización — Costeo variable por persona → Plantillas por Servicio con margen mínimo y alertas'},
   {label:'Operación — Seguimiento manual → PM system con responsables, fechas, gates y desviaciones'},
   {label:'Finanzas — Rentabilidad tardía → Rentabilidad por proyecto, cliente y Servicio casi en tiempo real'},
   {label:'Talento — Carga invisible → HH disponibles, HH vendidas, picos y valles por Servicio'},
   {label:'Medición — Resultados poco sistemáticos → Dashboard de resultados, recompra y aprendizajes'},
  ]},
  {g:'Automatizaciones prioritarias',items:[
   {label:'Calificación de leads — Scoring por fit, ticket, margen y probabilidad'},
   {label:'Brief — Formulario estándar + validación automática'},
   {label:'Cotización — Calculadora por Servicio con margen mínimo'},
   {label:'Propuestas — Plantillas por solución / Servicio'},
   {label:'Seguimiento operativo — Alertas de gates, fechas y pendientes'},
   {label:'Cierre financiero — Comparación margen esperado vs real'},
   {label:'Satisfacción — Encuesta de satisfacción + analíticas'},
  ]},
 ],
 roadDone:{}, // checks del roadmap 90 días, clave "ola-item"
};
let S=JSON.parse(JSON.stringify(DEFAULTS));
let CUR='resumen';

/* static qualitative content */
const SERVICES=['EVENTOS','BTL / ACTIVACIONES','EXPOS / STANDS','DIGITAL','POP / IMPRESOS','PROMOCIONALES / MERCH','FULLFILMENT','TRADE','SERVICIOS / IGUALAS'];
const GATES=[
 ['Lead','Account Owner','Lead aceptado o rechazado','% leads calificados'],
 ['Brief','Account + PM','Brief completo','% briefs completos'],
 ['Propuesta','Cotización + Servicio','Propuesta rentable','Margen esperado'],
 ['Cierre','Account + Finanzas','Proyecto autorizado','% anticipo recibido'],
 ['Producción','Servicio responsable','Listo para ejecutar','Retrabajos'],
 ['Ejecución','PM + Operación','Entrega sin desviaciones','Q / t / $'],
 ['Medición','PM + Data','Cierre financiero-operativo','Margen real'],
 ['Recompra','Account Owner','Nueva oportunidad','Tasa de recompra'],
];
const PROCESOS=[
 ['Brief comercial','Define alcance, costo, margen y tiempos desde el inicio','Checklist de brief'],
 ['Cotización','Protege margen y evita vender proyectos no rentables','Plantilla de costeo por Servicio'],
 ['Asignación de capacidad','Evita sobrecargas y cuellos de botella','Tablero HH por Servicio'],
 ['Gestión de proveedores','Controla costo, calidad y tiempos','Catálogo y scorecard proveedor'],
 ['Cierre de proyecto','Convierte ejecución en aprendizaje y recompra','Formato postmortem Kaizen'],
];
const ROLES=[
 ['Account Owner','Relación, venta, expansión y retención del cliente','Ventas, recompra, concentración, LTV'],
 ['Líder Servicio','Margen, capacidad, calidad y especialización de la unidad','EBITDA Servicio, margen, utilización HH'],
 ['Project Manager','Gates, tiempos, entregables, desviaciones Q/t/$','Retrabajos, desviaciones, cumplimiento'],
 ['Especialista / Producción','Ejecución técnica y estandarización operativa','Productividad HH, calidad, retrabajo'],
 ['Finanzas comercial','Costeo, pricing, margen mínimo y rentabilidad por proyecto','Margen proyecto, punto de equilibrio'],
 ['Data / IA Ops','Automatización, dashboards y mejora de procesos','Horas ahorradas, adopción, eficiencia'],
];
const PRINCIPIO=[
 ['Herramientas sueltas','Sistema integrado por Servicio'],
 ['Reportes manuales','Dashboards vivos'],
 ['IA como experimento','IA aplicada a procesos con impacto en Q / t / $'],
 ['Datos dispersos','Data accionable para decidir'],
];
const DIGITAL=[
 ['Comercial','Pipeline disperso / baja trazabilidad','CRM único por cliente, Servicio, etapa, ticket y margen'],
 ['Brief','Información incompleta y retrabajo','Brief digital con campos obligatorios y gate de avance'],
 ['Cotización','Costeo variable por persona','Plantillas por Servicio con margen mínimo y alertas'],
 ['Operación','Seguimiento manual y urgencias','PM system con responsables, fechas, gates y desviaciones'],
 ['Finanzas','Rentabilidad tardía','Rentabilidad por proyecto, cliente y Servicio casi en tiempo real'],
 ['Talento','Carga invisible','HH disponibles, HH vendidas, picos y valles por Servicio'],
 ['Medición','Resultados poco sistemáticos','Dashboard de resultados, recompra y aprendizajes'],
];
const ROADMAP=[
 ['0–30 días',['Brief','Paquetes "combo"','Perfiles de puestos','Evaluación de proveedores A y C','Monday','Encuesta de satisfacción']],
 ['31–60 días',['Proveedores de automatización','Cost management','Evaluaciones estado actual','Entrenamiento','Semillero administrativo']],
 ['61–90 días',['Integración de dashboards por Servicio','Pilotos de IA aplicada','Revisión de margen real vs esperado','Sistema antifrágil en marcha']],
];

/* ================= COMPUTE ================= */
function cFin(){const f=S.fin;const gb=f.ventas.map((v,i)=>v*f.margen[i]);
 const ue=f.ventas.map((v,i)=>v*f.utilEsp[i]);
 const cap=gb.map((g,i)=>g-ue[i]);
 const dif=cap.map((c,i)=>c-f.presup[i]);
 return {gb,ue,cap,dif,
  brVentas:f.ventas[5]-f.ventas[0],brGB:gb[5]-gb[0],
  ccc:S.caja.cobranza-S.caja.pago,
  inv:(S.caja.cobranza-S.caja.pago)/365*f.ventas[5]+S.caja.cajaMin};}
function cUE(u){const util=u.v*u.m-u.g;const pe=u.m>0?(u.v*u.m-u.g)/u.m:null;return {util,pe};}

/* ================= HELPERS ================= */
const $=(s,e=ROOT)=>e.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const grp=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:3});
const money=v=>v==null?'—':(v<0?'−':'')+'$'+Math.abs(v).toLocaleString('en-US',{maximumFractionDigits:0});
const money1=v=>v==null?'—':(v<0?'−':'')+'$'+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});
const pct=(v,d=0)=>v==null?'—':(v*100).toFixed(d)+'%';
const ICON={
 flag:'<path d="M4 2v15M4 3h10l-2 3 2 3H4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
 grid:'<rect x="2" y="2" width="6" height="6" rx="1"/><rect x="11" y="2" width="6" height="6" rx="1"/><rect x="2" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/>',
 coin:'<circle cx="9.5" cy="9.5" r="7.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 5.5v8M7 7.5h4a1.5 1.5 0 010 3H7.5a1.5 1.5 0 000 3H12" fill="none" stroke="currentColor" stroke-width="1.4"/>',
 users:'<circle cx="7" cy="7" r="3"/><path d="M2 17a5 5 0 0110 0" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="14" cy="7.5" r="2.2"/><path d="M13 13a4 4 0 014 4" fill="none" stroke="currentColor" stroke-width="1.3"/>',
 flow:'<circle cx="4" cy="4" r="2.2"/><circle cx="15" cy="4" r="2.2"/><circle cx="9.5" cy="15" r="2.2"/><path d="M5.5 5.5l3 8M13.5 5.5l-3 8" stroke="currentColor" stroke-width="1.3"/>',
 people:'<circle cx="6" cy="6.5" r="2.6"/><circle cx="13" cy="6.5" r="2.6"/><path d="M1.5 16a4.5 4.5 0 019 0M8.5 16a4.5 4.5 0 019 0" fill="none" stroke="currentColor" stroke-width="1.3"/>',
 chip:'<rect x="4" y="4" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="7" y="7" width="5" height="5"/><path d="M7 1.5v2.5M12 1.5v2.5M7 15v2.5M12 15v2.5M1.5 7H4M1.5 12H4M15 7h2.5M15 12h2.5" stroke="currentColor" stroke-width="1.2"/>',
};
function setIcons(){ROOT.querySelectorAll('[data-i]').forEach(s=>{s.innerHTML=`<svg viewBox="0 0 19 19" width="100%" height="100%" fill="currentColor">${ICON[s.dataset.i]||''}</svg>`;});}
function uMark(fill,size){return `<svg width="${size}" height="${size*1.08}" viewBox="0 0 100 108"><path d="M6 0 L6 60 Q6 104 50 104 Q94 104 94 60 L94 0 L50 40 Z" fill="${fill}"/></svg>`;}
function inp(path,val,type,w){let disp=type==='pct'?val*100:val;disp=type==='int'?Math.round(disp):Math.round(disp*100)/100;
 const step=type==='pct'?'0.5':type==='int'?'1':'0.1';const suf=type==='pct'?'<span class="isuf">%</span>':'';
 return `<span class="inwrap"><input class="inp" type="text" inputmode="decimal" data-bind="${path}" data-t="${type}" value="${grp(disp)}" style="width:${w||60}px">${suf}</span>`;}
// input verde de TEXTO (mismo look que inp, pero guarda string)
function itxt(path,val,w,ph){const ww=typeof w==='number'?w+'px':(w||'120px');return `<span class="inwrap"${w==='100%'?' style="display:block"':''}><input class="inp" type="text" data-bind="${path}" data-t="text" value="${esc(val||'')}" placeholder="${ph||''}" style="width:${ww};text-align:left"></span>`;}
// textarea verde editable (para textos largos): mismo verde/azul, guarda string
function iarea(path,val,rows,bold){return `<textarea class="inp iarea${bold?' b':''}" data-bind="${path}" data-t="text" rows="${rows||2}">${esc(val||'')}</textarea>`;}
// fecha editable (verde) con selector de fecha nativo
function idate(path,val){return `<input class="inp idate" type="date" data-bind="${path}" data-t="text" value="${esc(val||'')}">`;}
const editBadge='<span class="editbadge"><i></i>Celdas verdes = captura editable · recalcula en vivo</span>';
function ed(view,r,c,val){return `<span class="ed" contenteditable="true" data-view="${view}" data-r="${r}" data-c="${c}">${esc(val)}</span>`;}
function comboChart(bars,line,labels,{h=200}={}){const W=720,H=h,pl=46,pr=46,pt=14,iw=W-pl-pr,ih=H-pt-26;
 const bmax=Math.max(...bars,0),bmin=Math.min(...bars,0),lmin=Math.min(...line),lmax=Math.max(...line),n=bars.length,bw=iw/n*0.5;
 const by=v=>pt+ih*((bmax-v)/((bmax-bmin)||1)),y0=pt+ih*(bmax/(bmax-bmin||1)),lx=i=>pl+iw*(i+0.5)/n,ly=v=>pt+ih*((lmax-v)/((lmax-lmin)||1));
 let g=`<line x1="${pl}" x2="${pl+iw}" y1="${y0}" y2="${y0}" stroke="#D2D2C8" stroke-width="1"/>`;
 bars.forEach((v,i)=>{const x=pl+iw*(i+0.5)/n-bw/2,yy=v>=0?by(v):y0,hh=Math.abs(by(v)-y0);
  g+=`<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hh,1).toFixed(1)}" rx="3" fill="${i===n-1?'#C7E84A':'#0B0B0C'}"/>`;});
 g+=`<polyline points="${line.map((v,i)=>lx(i).toFixed(1)+','+ly(v).toFixed(1)).join(' ')}" fill="none" stroke="#5A6E00" stroke-width="2.4"/>`;
 line.forEach((v,i)=>{g+=`<circle cx="${lx(i).toFixed(1)}" cy="${ly(v).toFixed(1)}" r="3.4" fill="#fff" stroke="#5A6E00" stroke-width="2"/>`;});
 labels.forEach((l,i)=>{g+=`<text x="${lx(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#74756C">${l}</text>`;});
 // etiquetas de datos: ventas sobre la barra, ganancia bruta sobre la línea
 bars.forEach((v,i)=>{g+=`<text x="${lx(i).toFixed(1)}" y="${(by(v)-6).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9.5" font-weight="700" fill="#0B0B0C" paint-order="stroke" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round">${money(v)}</text>`;});
 line.forEach((v,i)=>{g+=`<text x="${lx(i).toFixed(1)}" y="${(ly(v)+15).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#5A6E00" paint-order="stroke" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round">${money(v)}</text>`;});
 return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">${g}</svg>`;}
function hbar(rows,{max,fmt=money}={}){const mx=max||Math.max(...rows.map(r=>Math.abs(r[1])),0.0001);
 return `<div style="display:flex;flex-direction:column;gap:9px">`+rows.map(r=>{const w=Math.abs(r[1])/mx*100,col=r[2]||'var(--ink)';
  return `<div style="display:grid;grid-template-columns:160px 1fr 70px;align-items:center;gap:10px"><span style="font-size:12px;font-weight:500">${r[0]}</span>
   <span style="height:18px;background:var(--paper-2);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${w.toFixed(1)}%;background:${col};border-radius:5px"></span></span>
   <span class="mono" style="text-align:right;font-size:11.5px;font-weight:600">${fmt(r[1])}</span></div>`;}).join('')+`</div>`;}
function tcard(cols,rows,opt={}){const head=cols.map(c=>`<th>${c}</th>`).join('');
 const body=rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
 return `<div class="tcard"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;}

/* ================= VIEWS ================= */
const META={
 resumen:['Rumbo 2030','Plan estratégico · Marketing United'],
 portafolio:['Portafolio 2030','¿Qué Servicios crecer, rediseñar o eliminar?'],
 financiero:['Modelo financiero 2030','Cuánto vender, cuánto dejar, cuánto gastar — MDP'],
 comercial:['Modelo comercial 2030','A quién vender, con qué margen y qué reglas'],
 operativo:['Modelo operativo 2030','Convertir demanda en entrega rentable y repetible'],
 talento:['Modelo de talento 2030','Estructura por Servicio, productividad y backups'],
 tecnologia:['Tecnología, IA y Data 2030','Velocidad, margen, control y escala por Servicio'],
 roadmap:['Roadmap 90 días','Plan de ejecución · Actual → sistema 2030'],
};

function vResumen(){
 const f=cFin();const v=el('div','view');
 const crecer=S.uen.filter(u=>u.dec==='Crecer').length,redis=S.uen.filter(u=>u.dec==='Rediseñar').length,elim=S.uen.filter(u=>u.dec==='Eliminar').length;
 v.innerHTML=`
  <div class="hero" style="margin-bottom:18px">
    <div class="lead">Rumbo al 2030</div>
    <div class="big" style="font-size:42px;line-height:1.06">De $${Math.round(S.fin.ventas[0])} a <span style="color:var(--lime)">$${Math.round(S.fin.ventas[5])} MDP</span></div>
    <div class="uline"></div>
    <div class="stack">
      <div class="it"><div class="l">Ventas 2030</div><div class="v">$${Math.round(S.fin.ventas[5])}<span style="font-size:14px;color:#9a9b90"> MDP</span></div><div class="d pos">▲ +$${Math.round(f.brVentas)} vs hoy</div></div>
      <div class="it"><div class="l">Margen bruto 2030</div><div class="v">${pct(S.fin.margen[5],0)}</div><div class="d pos">▲ +${((S.fin.margen[5]-S.fin.margen[0])*100).toFixed(1)} pts</div></div>
      <div class="it"><div class="l">Inversión requerida (caja)</div><div class="v">$${Math.round(f.inv)}<span style="font-size:14px;color:#9a9b90"> MDP</span></div><div class="d">CCC ${f.ccc} días</div></div>
    </div>
  </div>
  <div class="divh"><span class="n">↗</span>Trayectoria financiera</div>
  <div class="card cpad" style="margin-bottom:16px"><div class="chead"><span class="t">Ventas y ganancia bruta · Actual → 2030</span><span class="k">barras MDP · línea GB</span></div>
      <div id="ch30"></div>
      <div class="legend"><span><i style="width:11px;height:11px;background:var(--ink);border-radius:2px;display:inline-block"></i>Ventas</span>
      <span><i style="width:11px;height:11px;background:var(--lime);border-radius:2px;display:inline-block"></i>Meta 2030</span>
      <span><i style="width:14px;height:3px;background:var(--lime-deep);display:inline-block"></i>Ganancia bruta</span></div></div>
  <div>
    <div class="card cpad"><div class="chead"><span class="t">Decisión de portafolio</span><span class="k">9 Servicio</span></div>
      <div style="display:flex;gap:10px;margin-bottom:14px">
        <div style="flex:1;text-align:center;background:#EAF7E2;border-radius:10px;padding:12px"><div style="font-family:var(--disp);font-weight:700;font-size:26px;color:#2f6b1f">${crecer}</div><div style="font-size:11px;color:#2f6b1f;font-weight:600">Crecer</div></div>
        <div style="flex:1;text-align:center;background:#FDEEDA;border-radius:10px;padding:12px"><div style="font-family:var(--disp);font-weight:700;font-size:26px;color:#9A6212">${redis}</div><div style="font-size:11px;color:#9A6212;font-weight:600">Rediseñar</div></div>
        <div style="flex:1;text-align:center;background:#FBE9E5;border-radius:10px;padding:12px"><div style="font-family:var(--disp);font-weight:700;font-size:26px;color:#B0341F">${elim}</div><div style="font-size:11px;color:#B0341F;font-weight:600">Eliminar</div></div>
      </div>
      <div style="font-size:12.5px;color:var(--muted)">El portafolio 2030 concentra capacidad en los motores de margen (Trade, BTL, Expos, Eventos), rediseña las unidades de bajo margen y reestructura Fullfilment, que hoy drena rentabilidad.</div>
    </div>
  </div>
  <div class="divh" style="margin-top:18px"><span class="n">6</span>Frentes del plan</div>
  <div class="g3">
    ${frente('Portafolio','Qué Servicio crecer, rediseñar o eliminar rumbo a 2030.','portafolio')}
    ${frente('Financiero','Meta de ventas, margen, capacidad de gasto y caja.','financiero')}
    ${frente('Comercial','Cliente ideal, adquisición y retención por servicio.','comercial')}
    ${frente('Operativo','Flujo por gates, procesos críticos y estándares Q/t/$.','operativo')}
    ${frente('Talento','Estructura por Servicio, productividad y brechas de capacidad.','talento')}
    ${frente('Tecnología · IA','De herramientas sueltas a un sistema integrado por Servicio.','tecnologia')}
  </div>`;
 setTimeout(()=>{const c=$('#ch30',v);if(c)c.innerHTML=comboChart(S.fin.ventas,cFin().gb,YEARS,{h:240});},0);
 return v;
}
function frente(t,d,go){return `<div class="bd" data-go="${go}" style="cursor:pointer"><h4 style="font-family:var(--disp);font-weight:600;font-size:16px;margin:0 0 6px">${t}</h4>
  <div class="q" style="font-size:12.5px;color:var(--muted)">${d}</div><div style="margin-top:10px"><span class="chiplim">Abrir →</span></div></div>`;}

function vPortafolio(){
 const v=el('div','view');
 const decs=['Crecer','Rediseñar','Eliminar','Mantener'];
 const roles=['Motor estrella','Motor principal','Motor','Escalar con margen','Estandarizar','Controlar volumen','Ingreso recurrente','Reestructurar o salir'];
 const rolOpts=u=>(roles.includes(u.rol)?roles:[u.rol,...roles]).map(r=>`<option ${u.rol===r?'selected':''}>${r}</option>`).join('');
 const rows=S.uen.map((u,i)=>`<tr>
   <td style="font-weight:600"><span class="ed svcname" contenteditable="true" spellcheck="false" data-i="${i}" data-old="${esc(u.name)}">${esc(u.name)}</span><button class="rowdel" data-act="del-svc" data-i="${i}" data-name="${esc(u.name)}" title="Quitar servicio">×</button></td>
   <td><select class="dsel" data-dec="${i}">${decs.map(d=>`<option ${u.dec===d?'selected':''}>${d}</option>`).join('')}</select></td>
   <td><span class="decpill dec-${u.dec}">${u.dec}</span></td>
   <td><select class="rsel" data-rol="${i}">${rolOpts(u)}</select></td>
   <td style="color:var(--muted)">${ed('uen',i,'just',u.just)}</td></tr>`).join('');
 const mixRows=S.mix.map((m,i)=>`<tr><td style="font-weight:600">${m.f}</td><td>${inp('mix.'+i+'.a',m.a,'int',52)}</td><td>${inp('mix.'+i+'.o',m.o,'int',52)}</td>
   <td>${ed('mix',i,'dec',m.dec)}</td></tr>`).join('');
 const sumA=S.mix.reduce((a,b)=>a+b.a,0),sumO=S.mix.reduce((a,b)=>a+b.o,0);
 v.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
   <div class="sectsub">Cada Servicio recibe una decisión estratégica 2030. Cambia la decisión y el rol; la justificación parte del desempeño real 2026.</div>${editBadge}</div>
  <div class="card cpad"><div class="chead"><span class="t">Decisión estratégica por servicio</span><div class="cheadr"><span class="k">${S.uen.length} Servicio</span><button class="addbtn" data-act="add-svc">＋ Agregar servicio</button></div></div>
   <table class="tbl" style="text-align:left"><thead><tr><th style="text-align:left">Servicio</th><th style="text-align:left">Decisión 2030</th><th style="text-align:left">Estado</th><th style="text-align:left">Rol estratégico</th><th style="text-align:left">Justificación</th></tr></thead>
   <tbody>${rows}</tbody></table></div>
  <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">Mix de ingresos 2030</span><span class="k">% de la venta</span></div>
   <table class="tbl" style="text-align:left"><thead><tr><th style="text-align:left">Fuente</th><th>Actual %</th><th>2030 %</th><th style="text-align:left">Decisión</th></tr></thead>
   <tbody>${mixRows}<tr class="sum"><td>Total</td><td class="mono">${sumA}%</td><td class="mono">${sumO}%</td><td></td></tr></tbody></table>
   <div class="note">Meta 2030: reducir Grupo Salinas del ${S.mix[0].a}% al ${S.mix[0].o}% y crecer clientes externos al ${S.mix[1].o}%. ${sumO!==100?'<b style="color:var(--neg)">El mix 2030 suma '+sumO+'%, ajusta a 100%.</b>':'Mix 2030 cuadrado al 100%.'}</div></div>`;
 return v;
}

function vFinanciero(){
 const f=cFin();const v=el('div','view');
 const yhead=YEARS.map((y,i)=>`<th class="${i===5?'y30':''}">${y}</th>`).join('');
 const rowNum=(label,path,arr,type,tail)=>`<tr><td>${label}</td>${arr.map((x,i)=>`<td class="${i===5?'y30':''}">${inp(path+'.'+i,x,type, type==='pct'?48:58)}</td>`).join('')}${tail!=null?`<td class="mono" style="text-align:right">${tail}</td>`:''}</tr>`;
 const rowAuto=(label,arr,fmt,tail)=>`<tr class="auto"><td>${label}</td>${arr.map((x,i)=>`<td class="${i===5?'y30':''}">${fmt(x)}</td>`).join('')}${tail!=null?`<td class="mono pos" style="text-align:right">${tail}</td>`:''}</tr>`;
 const ueRows=S.ue.map((u,i)=>{const c=cUE(u);return `<tr>
   <td style="font-weight:600">${u.name}</td><td>${inp('ue.'+i+'.v',u.v,'int',54)}</td><td>${inp('ue.'+i+'.m',u.m,'pct',48)}</td>
   <td>${inp('ue.'+i+'.g',u.g,'num',50)}</td><td class="${c.util>=0?'pos':'neg'}"><b>${money1(c.util)}</b></td><td>${c.pe==null?'—':money1(c.pe)}</td></tr>`;}).join('');
 v.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
   <div class="sectsub">El motor financiero del plan. Captura ventas, margen y supuestos por año; ganancia bruta, capacidad de gasto, punto de equilibrio, CCC e inversión recalculan solos.</div>${editBadge}</div>
  <div class="card cpad"><div class="chead"><span class="t">1 · Meta financiera 2030</span><span class="k">MDP</span></div>
   <table class="yeartbl"><thead><tr><th>Indicador</th>${yhead}<th>Brecha</th></tr></thead><tbody>
     ${rowNum('Ventas totales','fin.ventas',S.fin.ventas,'num','')}
     ${rowNum('Margen bruto (%)','fin.margen',S.fin.margen,'pct','')}
     ${rowAuto('Ganancia bruta',f.gb,money,'+$'+Math.round(f.brGB))}
   </tbody></table>
   <div class="note">Ganancia bruta = Ventas × Margen bruto. Brecha = meta 2030 − actual.</div></div>
  <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">2 · Capacidad de gasto (Profit First multi-año)</span><span class="k">MDP</span></div>
   <table class="yeartbl"><thead><tr><th>Concepto</th>${yhead}</tr></thead><tbody>
     ${rowAuto('Ganancia bruta',f.gb,money)}
     ${rowNum('Utilidad esperada (%)','fin.utilEsp',S.fin.utilEsp,'pct')}
     ${rowAuto('Utilidad esperada $',f.ue,money)}
     ${rowAuto('Capacidad de gasto',f.cap,money)}
     ${rowNum('Presupuesto de gastos','fin.presup',S.fin.presup,'num')}
     ${(()=>`<tr class="sum"><td>Diferencia</td>${f.dif.map((d,i)=>`<td class="${i===5?'y30':''} ${d>=0?'pos':'neg'}">${money(d)}</td>`).join('')}</tr>`)()}
   </tbody></table>
   <div class="note">Capacidad de gasto = Ganancia bruta − Utilidad esperada. Diferencia positiva = holgura; negativa = sobre-gasto.</div></div>
  <div class="g2" style="margin-top:16px">
   <div class="card cpad"><div class="chead"><span class="t">3 · Unit economics objetivo 2030</span><span class="k">${S.ue.length} servicios · MDP</span></div>
     <table class="tbl" style="text-align:left"><thead><tr><th style="text-align:left">Servicio</th><th>Ventas</th><th>Margen</th><th>Gasto</th><th>Utilidad</th><th>Pto. Eq.</th></tr></thead>
     <tbody>${ueRows}</tbody></table>
     <div class="note">Utilidad = Ventas × Margen − Gasto asignado. Pto. Eq. = (Ventas × Margen − Gasto) ÷ Margen.</div></div>
   <div class="card cpad"><div class="chead"><span class="t">4 · Caja y capital de trabajo</span><span class="k">MDP / días</span></div>
     <table class="tbl"><tbody>
       <tr><td>Días de cobranza</td><td>${inp('caja.cobranza',S.caja.cobranza,'int',54)}</td></tr>
       <tr><td>Días de pago</td><td>${inp('caja.pago',S.caja.pago,'int',54)}</td></tr>
       <tr class="sum"><td>CCC (ciclo de conversión de caja)</td><td class="mono">${f.ccc} días</td></tr>
       <tr><td>Caja mínima operativa</td><td>${inp('caja.cajaMin',S.caja.cajaMin,'num',54)}</td></tr>
       <tr class="sum" style="background:rgba(211,255,0,.10)"><td><b>Inversión requerida</b></td><td class="mono"><b>$${Math.round(f.inv)} MDP</b></td></tr>
     </tbody></table>
     <div class="note">CCC = días cobranza − días pago. Inversión = CCC ÷ 365 × ventas 2030 + caja mínima.</div></div>
  </div>`;
 return v;
}

function vComercial(){
 const v=el('div','view');
 // lista dinámica desde S.ue: incluye los servicios agregados en Portafolio.
 // Todas las columnas son input verde editable y se guardan por servicio en S.ue[i].
 const rows=S.ue.map((u,i)=>[`<b>${u.name}</b>`,
   itxt('ue.'+i+'.cli',u.cli,150,'¿Cliente ideal?'),
   inp('ue.'+i+'.ticket',u.ticket||0,'int',90),
   inp('ue.'+i+'.mmin',u.mmin||0,'pct',56),
   inp('ue.'+i+'.recompra',u.recompra||0,'pct',56)]);
 v.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
   <div class="sectsub">A quién vender, qué venderle, con qué margen mínimo y con qué reglas para no crecer a costa de complejidad. Captura el cliente ideal por servicio.</div><span class="editbadge"><i></i>Campos editables · captura en sesión</span></div>
  <div class="card cpad"><div class="chead"><span class="t">1 · Cliente ideal por servicio</span><span class="k">define el foco comercial</span></div>
   ${tcard(['Servicio','Cliente ideal','Ticket objetivo','Margen mín.','Recompra esp.'],rows)}</div>
  <div class="g2" style="margin-top:16px">
   <div class="card cpad"><div class="chead"><span class="t">2 · Estrategia de adquisición</span><span class="k">canales prioritarios</span></div>
     ${tcard(['Canal prioritario','Oferta de entrada','Tipo de cliente','Responsable'],[
       ['<b>Grupo Salinas</b>','Cross-sell entre empresas del Grupo','Cuentas internas','Comercial'],
       ['<b>Referidos / CoMarketing</b>','Caso de éxito + alianza','Externos afines','Comercial'],
       ['<b>Outbound dirigido</b>','Diagnóstico de marketing','Empresas medianas','Comercial / MD'],
       ['<b>Digital inbound</b>','Contenido + lead magnet','Pymes y marcas','MKT Digital'],
     ])}</div>
   <div class="card cpad"><div class="chead"><span class="t">3 · Estrategia de retención</span><span class="k">riesgo de fuga</span></div>
     ${tcard(['Cliente / segmento','Riesgo de fuga','Acción de retención'],[
       ['<b>Grupo Salinas</b>','<span class="decpill dec-Eliminar">Alto</span>','QBR trimestral + roadmap conjunto'],
       ['<b>Externos clave</b>','<span class="decpill dec-Rediseñar">Medio</span>','Account plan + recompra programada'],
       ['<b>Recurrentes / igualas</b>','<span class="decpill dec-Crecer">Bajo</span>','Servicio repetible + upsell'],
     ])}</div>
  </div>`;
 return v;
}

function vOperativo(){
 const v=el('div','view');
 const svc=S.ue.map(u=>u.name); // lista dinámica: incluye los servicios agregados en Portafolio
 const gates=S.gates.map((g,i)=>`<div class="gaterow"><div class="gnum">${i+1}</div>
   <div>${iarea('gates.'+i+'.0',g[0],1,true)}</div><div>${iarea('gates.'+i+'.1',g[1],1)}</div>
   <div>${iarea('gates.'+i+'.2',g[2],1)}</div><div>${iarea('gates.'+i+'.3',g[3],1)}</div></div>`).join('');
 const stdRows=svc.map((s,i)=>[`<b>${s}</b>`,ed('stdQ',i,'x','—'),ed('stdT',i,'x','—'),ed('std$',i,'x','—')]);
 v.innerHTML=`
  <div class="sectsub" style="margin-bottom:16px">Diseñar una operación por Servicio que convierta demanda comercial en entrega rentable, medible y repetible.</div>
  <div class="card cpad"><div class="chead"><span class="t">1 · Flujo operativo por gates</span><span class="k">${S.gates.length} etapas</span></div>
   <div class="gaterow" style="border-bottom:1px solid var(--line-2)"><div></div><div class="mono" style="font-size:9px;color:var(--muted);text-transform:uppercase">Etapa</div><div class="mono" style="font-size:9px;color:var(--muted);text-transform:uppercase">Dueño</div><div class="mono" style="font-size:9px;color:var(--muted);text-transform:uppercase">Gate</div><div class="mono" style="font-size:9px;color:var(--muted);text-transform:uppercase">KPI</div></div>
   ${gates}</div>
  <div class="g2" style="margin-top:16px">
   <div class="card cpad"><div class="chead"><span class="t">2 · Procesos críticos a estandarizar</span><span class="k">Kaizen</span></div>
     ${tcard(['Proceso','Debe estandarizarse porque…','Documento / herramienta'],PROCESOS.map(p=>[`<b>${p[0]}</b>`,p[1],p[2]]))}</div>
   <div class="card cpad"><div class="chead"><span class="t">3 · Estándares de calidad (Q / t / $)</span><span class="k">tolerancias por servicio</span></div>
     ${tcard(['Servicio','Q','t','$'],stdRows)}
     <div class="note">Captura las tolerancias de calidad, tiempo y costo por servicio.</div></div>
  </div>`;
 return v;
}

function vTalento(){
 const v=el('div','view');
 const brechRows=S.talento.map((t,i)=>{const br=t.req-t.act;return `<tr>
   <td style="font-weight:600">${t.cap}</td><td>${inp('talento.'+i+'.act',t.act,'int',42)}</td><td>${inp('talento.'+i+'.req',t.req,'int',42)}</td>
   <td class="${br>0?'neg':'pos'}"><b>${br>0?'+'+br:br}</b></td><td style="color:var(--muted);font-family:var(--sans);font-weight:400;text-align:left">${t.accion}</td></tr>`;}).join('');
 v.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
   <div class="sectsub">Construir la estructura de talento para operar por Servicio, escalar productividad y reducir dependencia de personas clave.</div>${editBadge}</div>
  <div class="g2">
   <div class="card cpad"><div class="chead"><span class="t">1 · Estructura objetivo</span><span class="k">roles 2030</span></div>
     ${tcard(['Rol','Responsabilidad','Indicador'],S.roles.map((r,i)=>[iarea('roles.'+i+'.0',r[0],1,true),iarea('roles.'+i+'.1',r[1],2),iarea('roles.'+i+'.2',r[2],2)]))}</div>
   <div class="card cpad"><div class="chead"><span class="t">2 · Productividad del talento</span><span class="k">fórmulas</span></div>
     ${tcard(['Indicador','Fórmula','Uso'],S.prod.map((r,i)=>[iarea('prod.'+i+'.0',r[0],1,true),iarea('prod.'+i+'.1',r[1],2),iarea('prod.'+i+'.2',r[2],2)]))}</div>
  </div>
  <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">3 · Capacidades necesarias 2030</span><span class="k">brecha = requerido − actual (auto)</span></div>
   <table class="tbl" style="text-align:left"><thead><tr><th style="text-align:left">Capacidad</th><th>Nivel actual</th><th>Nivel requerido</th><th>Brecha</th><th style="text-align:left">Acción</th></tr></thead>
   <tbody>${brechRows}</tbody></table>
   <div class="note">Niveles 1–5. Brecha positiva = falta capacidad; prioriza las brechas más grandes para cerrar rumbo a 2030.</div></div>`;
 return v;
}

function vTecnologia(){
 const v=el('div','view');
 const total=S.tech.reduce((a,g)=>a+g.items.length,0);
 const done=S.tech.reduce((a,g)=>a+g.items.filter(it=>it.done).length,0);
 const groupCard=(g,gi)=>{
   const gd=g.items.filter(it=>it.done).length;
   const rows=g.items.map((it,ii)=>`<tr class="${it.done?'chkdone':''}">
     <td style="width:30px;text-align:center"><span class="chk ${it.done?'on':''}" data-chk data-g="${gi}" data-i="${ii}">${it.done?'✓':''}</span></td>
     <td style="text-align:left;font-weight:500;min-width:240px">${esc(it.label)}</td>
     <td style="width:140px">${idate('tech.'+gi+'.items.'+ii+'.fecha',it.fecha)}</td>
     <td style="width:130px">${itxt('tech.'+gi+'.items.'+ii+'.resp',it.resp,'100%','Responsable')}</td>
     <td style="width:200px">${itxt('tech.'+gi+'.items.'+ii+'.nec',it.nec,'100%','¿Qué se necesita?')}</td></tr>`).join('');
   return `<div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">${gi+1} · ${g.g}</span><span class="k">${gd}/${g.items.length} hechos</span></div>
     <div style="overflow-x:auto"><table class="tbl" style="text-align:left"><thead><tr><th></th><th style="text-align:left">Acción</th><th style="text-align:left">Fecha límite</th><th style="text-align:left">Responsable</th><th style="text-align:left">Necesidades</th></tr></thead>
     <tbody>${rows}</tbody></table></div></div>`;
 };
 v.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px">
   <div class="sectsub">Convertir tecnología, IA y data en una capa operativa que aumente velocidad, margen, control y escala por Servicio. Plan de trabajo: marca lo hecho y asigna fecha, responsable y necesidades por punto.</div>
   <span class="editbadge"><i></i>${done}/${total} completados</span></div>
  ${S.tech.map((g,gi)=>groupCard(g,gi)).join('')}`;
 return v;
}
function vRoadmap(){
 const v=el('div','view');
 const ola=(r,oi)=>{const tot=r[1].length,done=r[1].filter((_,ii)=>S.roadDone[oi+'-'+ii]).length;
   const items=r[1].map((x,ii)=>{const key=oi+'-'+ii,ok=!!S.roadDone[key];
     return `<div class="roaditem${ok?' done':''}" data-road="${key}"><span class="roadcheck"></span><span class="roadtxt">${x}</span></div>`;}).join('');
   return `<div class="card cpad"><div class="chead"><span class="t">${r[0]}</span><span class="k">${done}/${tot} completadas</span></div>
     <div>${items}</div></div>`;};
 v.innerHTML=`<div class="sectsub" style="margin-bottom:16px">Plan de ejecución de los primeros 90 días rumbo al sistema antifrágil 2030, en tres olas. <b>Marca lo que ya completaron.</b></div>
  <div style="display:flex;flex-direction:column;gap:16px">${ROADMAP.map(ola).join('')}</div>`;
 return v;
}

const RENDER={resumen:vResumen,portafolio:vPortafolio,financiero:vFinanciero,comercial:vComercial,operativo:vOperativo,talento:vTalento,tecnologia:vTecnologia,roadmap:vRoadmap};

/* ================= ANÁLISIS IA ================= */
function aiBar(topic){return `<div class="aiwrap" style="margin-bottom:16px">
   <div style="display:flex;justify-content:flex-end">
     <button class="aibtn" data-topic="${topic}">✦ Análisis profundo</button>
   </div>
   <div class="aipanel" style="display:none;margin-top:12px"></div></div>`;}
function aiPayload(){return {
   moneda:'MDP (millones de pesos)',horizonte:'Actual → 2030',anios:YEARS,
   financiero:S.fin,caja:S.caja,mixClientes:S.mix,
   portafolioServicios:S.uen,unitEconomics2030:S.ue,
   talento:S.talento,planTecnologiaIA:S.tech,
};}
function mdToHtml(md){
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/`(.+?)`/g,'<span class="mono">$1</span>');
  const out=[];let list=null;
  md.split(/\r?\n/).forEach(line=>{const l=line.trim();
    if(!l){if(list){out.push('</'+list+'>');list=null;}return;}
    const ord=/^\d+\.\s+(.*)/.exec(l);
    if(/^#{2,3}\s+/.test(l)){if(list){out.push('</'+list+'>');list=null;}out.push('<h4 class="aih">'+inline(l.replace(/^#{2,3}\s+/,''))+'</h4>');}
    else if(/^[-*]\s+/.test(l)){if(list!=='ul'){if(list)out.push('</'+list+'>');out.push('<ul class="ail">');list='ul';}out.push('<li>'+inline(l.replace(/^[-*]\s+/,''))+'</li>');}
    else if(ord){if(list!=='ol'){if(list)out.push('</'+list+'>');out.push('<ol class="ail">');list='ol';}out.push('<li>'+inline(ord[1])+'</li>');}
    else{if(list){out.push('</'+list+'>');list=null;}out.push('<p>'+inline(l)+'</p>');}});
  if(list)out.push('</'+list+'>');return out.join('');
}

/* ================= NAV / REACTIVITY ================= */
function go(name,keep){CUR=name;
 ROOT.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===name));
 const m=META[name];$('.vtitle').textContent=m[0];$('.vsub').textContent=m[1];
 const sy=keep?window.scrollY:0;const host=$('.views');host.innerHTML='';
 const node=RENDER[name]();if(name!=='roadmap')node.insertAdjacentHTML('afterbegin',aiBar(m[0]));host.appendChild(node);
 $('.side').classList.remove('open');window.scrollTo({top:keep?sy:0,behavior:'instant'});}
function recalc(){go(CUR,true);}
ROOT.addEventListener('change',e=>{const t=e.target;
 if(t.classList&&t.classList.contains('inp')){
   const p=t.dataset.bind.split('.');let o=S;for(let j=0;j<p.length-1;j++)o=o[p[j]];
   if(t.dataset.t==='text'){o[p[p.length-1]]=t.value;return;} // texto: guarda string, sin re-render
   let val=parseFloat(String(t.value).replace(/,/g,''));if(isNaN(val))val=0;if(t.dataset.t==='pct')val/=100;
   o[p[p.length-1]]=val;recalc();return;}
 if(t.classList&&t.classList.contains('dsel')){S.uen[+t.dataset.dec].dec=t.value;recalc();return;}
 if(t.classList&&t.classList.contains('rsel')){S.uen[+t.dataset.rol].rol=t.value;recalc();return;}});
ROOT.addEventListener('input',e=>{const t=e.target;
  if(t.classList&&t.classList.contains('svcname')){ // renombrar servicio: sincroniza con unit economics (S.ue)
    const i=+t.dataset.i,old=t.dataset.old,nn=t.textContent;
    if(S.uen[i])S.uen[i].name=nn;S.ue.forEach(x=>{if(x.name===old)x.name=nn;});t.dataset.old=nn;return;}
  if(t.classList&&t.classList.contains('ed')){
  const o=S[t.dataset.view];if(Array.isArray(o)&&t.dataset.c!=='x')o[+t.dataset.r][t.dataset.c]=t.textContent;}});
ROOT.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return;}
 const as=e.target.closest('[data-act="add-svc"]');if(as){ // agregar servicio en ambas tablas/pestañas
   const name='NUEVO SERVICIO '+(S.uen.length+1);
   S.uen.push({name,dec:'Crecer',rol:'Motor',just:''});
   S.ue.push({name,v:0,m:0.30,g:0});recalc();return;}
 const ds=e.target.closest('[data-act="del-svc"]');if(ds){if(S.uen.length>1){const nm=ds.dataset.name;S.uen.splice(+ds.dataset.i,1);S.ue=S.ue.filter(x=>x.name!==nm);recalc();}return;}
 const ck=e.target.closest('[data-chk]');if(ck){const g=+ck.dataset.g,i=+ck.dataset.i;S.tech[g].items[i].done=!S.tech[g].items[i].done;recalc();return;}
 const rd=e.target.closest('[data-road]');if(rd){S.roadDone[rd.dataset.road]=!S.roadDone[rd.dataset.road];recalc();return;}
 const tg=e.target.closest('[data-auto]');if(tg){const i=+tg.dataset.auto;S.auto[i].on=!S.auto[i].on;recalc();}});
ROOT.addEventListener('click',async e=>{
  const btn=e.target.closest?e.target.closest('.aibtn'):null;if(!btn||btn.disabled)return;
  const wrap=btn.closest('.aiwrap'),panel=wrap&&wrap.querySelector('.aipanel');if(!panel)return;
  const topic=btn.dataset.topic||'el plan 2030',label=btn.textContent;
  btn.disabled=true;btn.textContent='Analizando…';
  panel.style.display='block';panel.innerHTML='<div class="aiload"><span class="aispin"></span>GENERANDO ANÁLISIS PROFUNDO…</div>';
  try{
    const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,empresa:'Marketing United',payload:aiPayload()})});
    const data=await r.json();if(!r.ok)throw new Error(data.error||('Error '+r.status));
    panel.innerHTML='<div class="aihead"><span class="aibadge">✦ Análisis</span></div><div class="aibody">'+mdToHtml(data.text||'(sin respuesta)')+'</div>';
  }catch(err){panel.innerHTML='<div class="aierr">No se pudo generar el análisis: '+(err&&err.message?err.message:err)+'</div>';}
  finally{btn.disabled=false;btn.textContent=label;}
});
ROOT.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>go(a.dataset.v)));
$('.menubtn').addEventListener('click',()=>$('.side').classList.toggle('open'));
$('.resetbtn').addEventListener('click',()=>{S=JSON.parse(JSON.stringify(DEFAULTS));recalc();});
$('.brandchip').innerHTML=uMark('#C7E84A',24);
setIcons();try{window.__MU_rumbo=aiPayload;}catch(e){}go('resumen'); // publica la data del módulo para el "gran cierre" en Riesgos


  return () => { ROOT.innerHTML = ''; };
}
