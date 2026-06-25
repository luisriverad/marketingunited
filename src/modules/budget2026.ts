// @ts-nocheck
/* eslint-disable */
/**
 * Marketing United — módulo "budget2026".
 * Controlador autónomo: inyecta su layout (sidebar + top bar + vistas) en ROOT
 * y ejecuta su motor reactivo (estado, cálculos y render). Todo el manejo de
 * eventos está delegado a ROOT, así cada módulo es independiente.
 * Powered by AXON B2B.
 */
const BODY = `<div class="app">
  <aside class="side">
    <div class="brand">
      <div class="chip brandchip"></div>
      <div class="wm"><b>Marketing United</b><span>Presupuesto 2026</span></div>
    </div>
    <div class="navlbl">Información Financiera</div>
    <nav class="nav">
      <a data-v="resumen" class="on"><span class="ic" data-i="grid"></span>Resumen ejecutivo</a>
      <a data-v="pl"><span class="ic" data-i="bars"></span>Estado de resultados</a>
      <a data-v="profit"><span class="ic" data-i="coin"></span>Profit First</a>
    </nav>
    <div class="navlbl">Drivers Financieros</div>
    <nav class="nav">
      <a data-v="uen"><span class="ic" data-i="target"></span>Unit Economics · Servicio</a>
      <a data-v="drivers"><span class="ic" data-i="gauge"></span>Business Drivers</a>
    </nav>
    <div class="navlbl">Comercial · Operación · RRHH</div>
    <nav class="nav">
      <a data-v="comercial"><span class="ic" data-i="users"></span>Modelo comercial</a>
      <a data-v="operativo"><span class="ic" data-i="flow"></span>Modelo operativo Kaizen</a>
      <a data-v="capacidad"><span class="ic" data-i="layers"></span>Capacidad HH</a>
    </nav>
    <div class="foot">
      <div class="pw">Powered by AXON B2B</div>
    </div>
  </aside>

  <div class="main">
    <header class="top">
      <button class="menubtn" aria-label="Menú"><span class="ic" data-i="grid" style="color:var(--ink)"></span></button>
      <div>
        <h1 class="vtitle">Resumen ejecutivo</h1>
        <div class="sub vsub">Presupuesto 2026 · Cifras en MDP</div>
      </div>
      <div class="spacer"></div>
      <div class="seg" title="Escenario base del tablero"><b>REAL 25</b><b>PLAN 26</b><b class="on">FCST 26</b></div>
      <div class="pill">Ene–Dic 2026</div>
    </header>
    <div class="views"></div>
  </div>
</div>`;

export function createBudget2026(ROOT: HTMLElement): () => void {
  ROOT.innerHTML = BODY;

/* =================== STATIC DISPLAY DATA (vistas no editables) =================== */
const MES=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const PL=[
 ['Ingresos Internos',464.33,436.52,464.24,'rev'],['Ingresos Externos',18.34,65.00,28.53,'rev'],
 ['Total Ingresos',482.67,501.52,492.78,'sum'],['Activaciones',-336.06,-300.91,-307.14,'cost'],
 ['Comisiones',-0.45,-3.34,-0.67,'cost'],['Participación Socios',0,-2.29,0,'cost'],
 ['Costos Totales',-336.51,-306.54,-307.81,'sum'],['Contribución Bruta',146.16,194.98,184.97,'gross'],
 ['Personal',-39.82,-49.58,-46.40,'cost'],['Operación',-4.51,-4.82,-3.55,'cost'],
 ['Mercadotecnia',-2.17,-2.32,-1.40,'cost'],['Renta, Luz y Teléfono',-3.61,-4.43,-5.00,'cost'],
 ['Gastos de despacho GS',-2.72,-2.62,-3.34,'cost'],['Costo de Activo',-0.00,-0.09,-0.00,'cost'],
 ['Gastos Ventas',-6.03,-6.12,-4.99,'cost'],['Gastos Staff',-17.25,-17.84,-17.47,'cost'],
 ['Total Gastos',-76.11,-87.82,-82.16,'sum'],['Contribución Neta',70.04,107.16,102.81,'net'],
];
const M_CN=[-1.39,6.25,2.55,8.75,11.02,6.40,4.24,7.93,9.66,9.12,20.80,17.48];
const M_MG=[-8.15,19.34,10.33,21.88,26.47,17.40,13.99,19.79,21.53,20.86,27.69,26.43];
const STAFF=[
 ['Personal',-127.25,-148.14,-143.94],['Operación',-21.08,-20.39,-16.35],
 ['Gastos de despacho GS',-13.66,-12.59,-13.78],['Renta, Luz y Teléfono',-11.46,-9.25,-10.60],
 ['Desarrollo de Software',-4.30,-6.24,-6.68],['Mantenimiento de Software',-2.27,-3.91,-3.74],
 ['Mercadotecnia',-9.37,-3.14,-2.65],['Staff Sistemas',-1.01,-1.18,-1.28],
 ['Costo de Nube',-0.47,-1.20,-0.96],['Gastos UX/UI',0,0,-0.26],['Costo de Activo',-0.05,-0.05,-0.04],
];
const STAFF_TOT=[-190.92,-206.08,-200.30];
const BD=[
 ['01','Crecimiento Real','¿Crece la ganancia real o solo la facturación? (YoY ganancia bruta)','pct',
   [0.339,0.093,-0.171,-0.035,0.662,0.064,0.353,0.214,0.192,0.184,-0.323],[-0.245,0.403,-0.192,0.246,0.802],'−10% a 0%',[-0.10,0]],
 ['02','Margen de Absorción','De cada $100, ¿cuánto queda tras activaciones para gastos?','pct',
   [0.397,0.395,0.392,0.392,0.393,0.394,0.392,0.392,0.388,0.382,0.379,0.387],[0.329,0.400,0.366,null,0.426],'33% a 38%',[0.33,0.38]],
 ['03','Calidad de la Mezcla','¿El crecimiento viene del mercado o del propio Grupo?','pct',
   [0.040,0.062,0.098,0.089,0.082,0.073,0.095,0.090,0.141,0.211,0.242,0.154],[0.275,0.094,0.027,null,0.042],'5% a 13%',[0.05,0.13]],
 ['04','Productividad del Talento','¿Cada peso de sueldo genera suficiente ganancia?','x',
   [2.41,2.44,2.25,2.89,3.96,3.45,3.00,4.39,4.55,4.69,5.06,8.10],[1.45,3.57,2.33,3.97,4.58],'2.5x a 3.5x',[2.5,3.5]],
 ['05','Disciplina de Activación','¿Las campañas viven dentro de su margen? (GB mensual MDP)','mdp',
   [9.97,10.07,9.28,11.94,16.36,14.27,12.40,18.15,18.80,19.36,20.90,33.47],[5.62,12.93,9.05,15.42,17.74],'0 a 2 piso',[0,2]],
 ['06','Corporate Overhead Drag','¿Cuánto de la ganancia bruta se va en estructura corporativa?','pct',
   [0.136,0.144,0.161,0.120,0.088,0.101,0.119,0.081,0.083,0.079,0.077,0.048],[0.235,0.114,0.148,0.084,0.078],'10% a 15%',[0.10,0.15]],
 ['07','Ciclo de Recuperación de Efectivo','¿Cuántos días la caja financia la operación antes de cobrar?','d',[],[],'30 a 60 días',[30,60]],
];
const BOTTLE=[
 ['Prospección','Falta de perfiles claros de clientes','Sesgos en el brief, horas-hombre muertas','IA para identificar industrias/perfiles · cero tolerancia a briefs incompletos'],
 ['Propuesta','Recepción de briefs incompletos','Retrabajos','Catálogo de líneas estándar · definir cadena de mando desde el brief'],
 ['Negociación','Tiempos muy "quemados"','Retrabajos','Asumir riesgo de pérdida · presupuesto claro obligatorio'],
 ['Cierre','Comparación vs. otros proveedores','Tiempo perdido','Descuentos "listos para aplicar" desde la cotización'],
 ['Recompra','Mala experiencia','Pérdida de cliente','Sistema estructurado de seguimiento'],
];

/* =================== EDITABLE MODEL STATE (celdas de captura) =================== */
const DEFAULTS={
 pf:{ingreso:115.998,costoPct:0.62,utilPct:0.181,gastoAct:37.423},
 fGastoPropio:3.2222,
 uen:[
  {name:'Trade',ventas:20.9,costoPct:0.39,gastoFijo:1.85,cat:'Apuesta'},
  {name:'BTL / Activaciones',ventas:44.5,costoPct:0.58,gastoFijo:1.85,cat:'Motor'},
  {name:'Expos / Stands',ventas:28.2,costoPct:0.55,gastoFijo:1.85,cat:'Motor'},
  {name:'Eventos',ventas:17.6,costoPct:0.52,gastoFijo:1.85,cat:'Motor'},
  {name:'Promocionales / Merch',ventas:26.5,costoPct:0.74,gastoFijo:1.85,cat:'Motor'},
  {name:'Digital',ventas:8.8,costoPct:0.52,gastoFijo:1.85,cat:'Motor'},
  {name:'POP / Impresos',ventas:24.9,costoPct:0.78,gastoFijo:1.85,cat:'Motor'},
  {name:'Fullfilment',ventas:5.3,costoPct:0.72,gastoFijo:1.85,cat:'Apuesta'},
  {name:'Servicios / Igualas',ventas:0,costoPct:0,gastoFijo:1.85,cat:'Motor'},
 ],
 pareto:[
  {name:'Banco Azteca',venta:59000},{name:'Elektra',venta:37000},{name:'GS Motos',venta:29000},
  {name:'Total Play',venta:12400},{name:'Prestaprenda',venta:11000},{name:'Viamericas',venta:2500},{name:'Little Caesars',venta:2500},
 ],
 cac:[
  {name:'Grupo Salinas',inv:1250000,proy:500,cal:'Alta'},{name:'Alianzas',inv:300000,proy:30,cal:'Media'},
  {name:'CoMarketing',inv:250000,proy:8,cal:'Alta'},{name:'Marketing Corporativo',inv:1900000,proy:5,cal:'Baja'},
  {name:'Ferias',inv:400000,proy:0,cal:'—'},{name:'Eventos',inv:400000,proy:0,cal:'—'},{name:'Digital',inv:0,proy:0,cal:'—'},
 ],
 ltv:[
  {name:'Banco Azteca',ticket:422500,proy:400,al2030:5,margen:0.30},
  {name:'Elektra',ticket:753888.89,proy:180,al2030:5,margen:0.31},
  {name:'GS Motos',ticket:400425.53,proy:235,al2030:5,margen:0.34},
  {name:'Prestaprenda',ticket:677777.78,proy:90,al2030:5,margen:0.27},
  {name:'Total Play',ticket:58018.87,proy:424,al2030:5,margen:0.30},
  {name:'Little Caesars',ticket:2500000,proy:1,al2030:5,margen:0.39},
 ],
 vsm:[
  {n:'1',paso:'Lead',areas:'Comercial / Mkt',dias:5,cuello:1,retrab:1,rrhh:1,cli:0},
  {n:'2',paso:'Brief',areas:'Comercial / Cliente',dias:1,cuello:2,retrab:4,rrhh:4,cli:1},
  {n:'3',paso:'Debrief',areas:'Com / Creativo / Compras',dias:5,cuello:5,retrab:3,rrhh:5,cli:0},
  {n:'4',paso:'Diseño / Data',areas:'Creativo',dias:5,cuello:5,retrab:2,rrhh:3,cli:0},
  {n:'5',paso:'Cotización',areas:'Comercial / Compras',dias:4,cuello:5,retrab:3,rrhh:2,cli:0},
  {n:'6',paso:'Propuesta',areas:'Comercial / Creativo',dias:1,cuello:2,retrab:2,rrhh:2,cli:0},
  {n:'7',paso:'Ajustes',areas:'Com / Crea / Compras / Cliente',dias:3,cuello:3,retrab:5,rrhh:5,cli:1},
  {n:'8',paso:'Cierre',areas:'Comercial / Cliente',dias:1,cuello:1,retrab:2,rrhh:2,cli:0},
  {n:'9',paso:'Producción',areas:'Com / Crea / Compras / Prov',dias:15,cuello:2,retrab:2,rrhh:5,cli:0},
  {n:'10',paso:'Ejecución',areas:'Comercial / Proveedor',dias:3,cuello:2,retrab:2,rrhh:5,cli:0},
  {n:'11',paso:'Medición',areas:'Comercial',dias:1,cuello:1,retrab:1,rrhh:2,cli:0},
 ],
 cap:{headcount:90,dias:300,horas:8,inef:0.25,util:0.70,costoHH:166853.55},
 rrhh:{tiempoDisp:60,efic:1,demanda:18,tproceso:15,actual:3},
};
let S=JSON.parse(JSON.stringify(DEFAULTS));
let CUR='resumen';

/* =================== COMPUTE (replica de fórmulas) =================== */
function cPF(){const p=S.pf;const costo=p.ingreso*p.costoPct;const util=p.ingreso*p.utilPct;
  const cap=p.ingreso-costo-util;const capPct=p.ingreso?cap/p.ingreso:0;
  const gastoPct=p.ingreso?p.gastoAct/p.ingreso:0;const dif=cap-p.gastoAct;const difPct=gastoPct-capPct;
  return {ingreso:p.ingreso,costo,util,cap,capPct,gastoAct:p.gastoAct,gastoPct,dif,difPct};}
function semFromPct(r,ventas){if(!ventas)return 'g';if(r==null)return 'g';if(r>=0.20)return 'v';if(r>=0.10)return 'a';return 'r';}
function cUEN(u){const D=u.ventas*u.costoPct;const ra=u.ventas-D-S.fGastoPropio;const mc=u.ventas-D;
  return {D,rentAbs:u.ventas?ra:null,rentPct:u.ventas?ra/u.ventas:null,mcAbs:u.ventas?mc:null,mcPct:u.ventas?mc/u.ventas:null,sem:semFromPct(u.ventas?ra/u.ventas:null,u.ventas)};}
function cCap(){const c=S.cap;const inst=c.headcount*c.dias*c.horas;const act=inst*(1-c.inef);const vend=act*c.util;
  return {inst,act,vend,invInst:inst*c.costoHH,valAct:act*c.costoHH,costoInef:(inst-act)*c.costoHH,costoOciosa:(act-vend)*c.costoHH};}
function cRRHH(){const r=S.rrhh;const nec=(r.tiempoDisp*r.efic)?(r.demanda*r.tproceso)/(r.tiempoDisp*r.efic):0;
  return {nec,prop:nec?r.actual/nec:0};}

/* =================== HELPERS =================== */
const $=(s,e=ROOT)=>e.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const grp=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:3});
const money=v=>v==null?'—':(v<0?'−':'')+'$'+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});
const pct=(v,d=1)=>v==null?'—':(v*100).toFixed(d)+'%';
const ptsDelta=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(1);
const bigPeso=v=>'$'+Math.round(v/1e6).toLocaleString('en-US')+'M';
function deltaTag(fc,base,label){const d=fc-base;const good=d>=0;
  return `<span class="dd ${good?'pos':'neg'}">${good?'▲':'▼'} ${(d>=0?'+':'−')+'$'+Math.abs(d).toFixed(1)} <span class="cap">vs ${label}</span></span>`;}
const ICON={
 grid:'<rect x="2" y="2" width="6" height="6" rx="1"/><rect x="11" y="2" width="6" height="6" rx="1"/><rect x="2" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/>',
 bars:'<rect x="2" y="9" width="3.5" height="8" rx="1"/><rect x="8" y="4" width="3.5" height="13" rx="1"/><rect x="14" y="11" width="3.5" height="6" rx="1"/>',
 coin:'<circle cx="9.5" cy="9.5" r="7.5"/><path d="M9.5 5.5v8M7 7.5h4a1.5 1.5 0 010 3H7.5a1.5 1.5 0 000 3H12" fill="none" stroke="currentColor" stroke-width="1.4"/>',
 target:'<circle cx="9.5" cy="9.5" r="7.5"/><circle cx="9.5" cy="9.5" r="4"/><circle cx="9.5" cy="9.5" r="1"/>',
 gauge:'<path d="M3 14a7 7 0 0113 0" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 11l3-3" stroke="currentColor" stroke-width="1.5"/>',
 users:'<circle cx="7" cy="7" r="3"/><path d="M2 17a5 5 0 0110 0" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="14" cy="7.5" r="2.2"/><path d="M13 13a4 4 0 014 4" fill="none" stroke="currentColor" stroke-width="1.3"/>',
 flow:'<circle cx="4" cy="4" r="2.2"/><circle cx="15" cy="4" r="2.2"/><circle cx="9.5" cy="15" r="2.2"/><path d="M5.5 5.5l3 8M13.5 5.5l-3 8" stroke="currentColor" stroke-width="1.3"/>',
 layers:'<path d="M9.5 2l7 4-7 4-7-4z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 10l7 4 7-4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
};
function setIcons(){ROOT.querySelectorAll('[data-i]').forEach(s=>{s.innerHTML=`<svg viewBox="0 0 19 19" width="100%" height="100%" fill="currentColor">${ICON[s.dataset.i]||''}</svg>`;});}
function uMark(fill,size){return `<svg width="${size}" height="${size*1.08}" viewBox="0 0 100 108" aria-hidden="true"><path d="M6 0 L6 60 Q6 104 50 104 Q94 104 94 60 L94 0 L50 40 Z" fill="${fill}"/></svg>`;}

/* ---- editable input ---- */
function inp(path,val,type,w){
  let disp = type==='pct' ? val*100 : val;
  disp = type==='int' ? Math.round(disp) : Math.round(disp*1000)/1000;
  const step = type==='pct'?'0.1':type==='int'?'1':'0.01';
  const suf = type==='pct'?'<span class="isuf">%</span>':'';
  return `<span class="inwrap"><input class="inp" type="text" inputmode="decimal" data-bind="${path}" data-t="${type}" value="${grp(disp)}" style="width:${w||62}px">${suf}</span>`;
}
const editBadge='<span class="editbadge"><i></i>Celdas verdes = captura editable · recalcula en vivo</span>';

/* ---- charts (hex colors; var() no aplica en atributos de presentación SVG) ---- */
function comboChart(bars,line,labels,{h=200}={}){
  const W=720,H=h,pl=42,pr=42,pt=14,iw=W-pl-pr,ih=H-pt-26;
  const bmax=Math.max(...bars,0),bmin=Math.min(...bars,0),lmin=Math.min(...line),lmax=Math.max(...line),n=bars.length,bw=iw/n*0.56;
  const y0=pt+ih*(bmax/(bmax-bmin||1)),by=v=>pt+ih*((bmax-v)/((bmax-bmin)||1)),lx=i=>pl+iw*(i+0.5)/n,ly=v=>pt+ih*((lmax-v)/((lmax-lmin)||1));
  let g=`<line x1="${pl}" x2="${pl+iw}" y1="${y0}" y2="${y0}" stroke="#D2D2C8" stroke-width="1"/>`;
  bars.forEach((v,i)=>{const x=pl+iw*(i+0.5)/n-bw/2,yy=v>=0?by(v):y0,hh=Math.abs(by(v)-y0);
    g+=`<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hh,1).toFixed(1)}" rx="3" fill="${v>=0?'#0B0B0C':'#D8472F'}"/>`;});
  g+=`<polyline points="${line.map((v,i)=>lx(i).toFixed(1)+','+ly(v).toFixed(1)).join(' ')}" fill="none" stroke="#5A6E00" stroke-width="2.4" stroke-linejoin="round"/>`;
  line.forEach((v,i)=>{g+=`<circle cx="${lx(i).toFixed(1)}" cy="${ly(v).toFixed(1)}" r="3.4" fill="#FFFFFF" stroke="#5A6E00" stroke-width="2"/>`;});
  labels.forEach((l,i)=>{g+=`<text x="${lx(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#74756C">${l}</text>`;});
  // etiquetas de datos: valor de contribución sobre la barra y % de margen sobre la línea
  bars.forEach((v,i)=>{const hh=Math.abs(by(v)-y0);
    g+=`<text x="${lx(i).toFixed(1)}" y="${(v>=0?by(v)-5:y0+hh+11).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8.5" font-weight="600" fill="${v>=0?'#0B0B0C':'#D8472F'}" paint-order="stroke" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round">${money(v)}</text>`;});
  line.forEach((v,i)=>{g+=`<text x="${lx(i).toFixed(1)}" y="${(ly(v)-9).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8.5" font-weight="700" fill="#5A6E00" paint-order="stroke" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round">${v.toFixed(1)}%</text>`;});
  // capa interactiva: guía vertical + punto resaltado + zonas de hover por mes
  g+=`<line class="ch-guide" x1="0" x2="0" y1="${pt}" y2="${pt+ih}" stroke="#0B0B0C" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>`;
  g+=`<circle class="ch-dot" cx="0" cy="0" r="5" fill="#5A6E00" stroke="#FFFFFF" stroke-width="2" opacity="0"/>`;
  bars.forEach((v,i)=>{const seg=iw/n,cx=lx(i);
    g+=`<rect class="ch-hit" data-i="${i}" data-cx="${cx.toFixed(1)}" data-ly="${ly(line[i]).toFixed(1)}" x="${(pl+seg*i).toFixed(1)}" y="${pt}" width="${seg.toFixed(1)}" height="${ih.toFixed(1)}" fill="transparent" style="cursor:pointer"/>`;});
  return `<div class="ch-wrap" style="position:relative">`+
    `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">${g}</svg>`+
    `<div class="ch-tip" style="position:absolute;left:0;top:0;opacity:0;pointer-events:none;transform:translate(-50%,-115%);background:#0B0B0C;color:#EDEDE6;border:1px solid #2b2b27;border-radius:8px;padding:7px 10px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5;white-space:nowrap;z-index:5;box-shadow:0 10px 26px -14px rgba(0,0,0,.7);transition:opacity .1s"></div>`+
  `</div>`;
}
function wireCombo(c,bars,line,labels,svgW=720){
  const wrap=c.querySelector('.ch-wrap');if(!wrap)return;
  const svg=wrap.querySelector('svg'),tip=wrap.querySelector('.ch-tip'),guide=svg.querySelector('.ch-guide'),dot=svg.querySelector('.ch-dot');
  const hide=()=>{tip.style.opacity='0';guide.setAttribute('opacity','0');dot.setAttribute('opacity','0');};
  wrap.querySelectorAll('.ch-hit').forEach(r=>{
    const i=+r.dataset.i,cx=+r.dataset.cx,ly=+r.dataset.ly;
    r.addEventListener('mouseenter',()=>{
      const sc=svg.clientWidth/svgW;
      guide.setAttribute('x1',cx);guide.setAttribute('x2',cx);guide.setAttribute('opacity','0.45');
      dot.setAttribute('cx',cx);dot.setAttribute('cy',ly);dot.setAttribute('opacity','1');
      tip.innerHTML=`<b style="color:#C7E84A">${labels[i]}</b><br>Contribución: ${money(bars[i])} MDP<br>Margen: ${line[i].toFixed(1)}%`;
      tip.style.left=(cx*sc)+'px';tip.style.top=(ly*sc)+'px';tip.style.opacity='1';
    });
    r.addEventListener('mouseleave',hide);
  });
}
function hbar(rows,{max,fmt=money}={}){
  const mx=max||Math.max(...rows.map(r=>Math.abs(r[1])),0.0001);
  return `<div style="display:flex;flex-direction:column;gap:9px">`+rows.map(r=>{
    const w=Math.abs(r[1])/mx*100,col=r[2]||'var(--ink)';
    return `<div style="display:grid;grid-template-columns:150px 1fr 84px;align-items:center;gap:10px">
      <span style="font-size:12px;font-weight:500">${r[0]}</span>
      <span style="height:18px;background:var(--paper-2);border-radius:5px;overflow:hidden">
        <span style="display:block;height:100%;width:${w.toFixed(1)}%;background:${col};border-radius:5px"></span></span>
      <span class="mono" style="text-align:right;font-size:11.5px;font-weight:600">${fmt(r[1])}</span></div>`;
  }).join('')+`</div>`;
}
function sparkBand(pres,real,band){
  const W=240,H=64,pl=4,pt=8,iw=W-8,ih=H-16;
  const all=[...pres,...real.filter(x=>x!=null),...band];let mn=Math.min(...all),mx=Math.max(...all);
  if(mn===mx){mx+=1;mn-=1;}const pad=(mx-mn)*0.12;mn-=pad;mx+=pad;
  const X=i=>pl+iw*i/(Math.max(pres.length,5)-1),Y=v=>pt+ih*((mx-v)/(mx-mn));
  let g=`<rect x="${pl}" y="${Y(band[1]).toFixed(1)}" width="${iw}" height="${Math.abs(Y(band[0])-Y(band[1])).toFixed(1)}" fill="rgba(211,255,0,.30)"/>`;
  g+=`<line x1="${pl}" x2="${pl+iw}" y1="${Y(band[1]).toFixed(1)}" y2="${Y(band[1]).toFixed(1)}" stroke="#5A6E00" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>`;
  g+=`<polyline points="${pres.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="#0B0B0C" stroke-width="1.8"/>`;
  const rr=real.filter(x=>x!=null);
  if(rr.length)g+=`<polyline points="${rr.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="#D8472F" stroke-width="1.8" stroke-dasharray="4 3"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">${g}</svg>`;
}

/* =================== VIEWS =================== */
const META={
 resumen:['Resumen ejecutivo','Presupuesto 2026 · Cifras en MDP'],
 pl:['Estado de resultados','Real 2025 · Plan 2026 · Fcst 2026 — MDP'],
 profit:['Profit First','Modelo de asignación · presupuesto mensual'],
 uen:['Unit Economics por Servicio','Rentabilidad por Servicio · MDP'],
 drivers:['Business Drivers','7 indicadores · Presupuesto vs Real a mayo vs KPI'],
 comercial:['Modelo comercial','Pareto de clientes · CAC · LTV · cuellos de botella'],
 operativo:['Modelo operativo Kaizen','Flujo VSM · gates · pérdida por paso'],
 capacidad:['Capacidad instalada vs. actual','Horas-hombre · cuánto vale y cuánto se pierde'],
};

function vResumen(){
  const ing=PL[2],cb=PL[7],cn=PL[17],mgReal=0.145,mgPlan=0.214,mgFcst=0.209;
  const pf=cPF();
  const v=el('div','view');
  v.innerHTML=`
   <div class="hero">
     <div class="lead">Contribución neta · margen Fcst 2026</div>
     <div class="big">20.9%<small>de margen</small></div><div class="uline"></div>
     <div class="stack">
       <div class="it"><div class="l">Trayectoria de margen</div><div class="v">14.5% → 20.9%</div><div class="d pos">▲ +6.4 pts vs Real 2025</div></div>
       <div class="it"><div class="l">Contribución neta Fcst</div><div class="v">$102.8<span style="font-size:14px;color:#9a9b90"> MDP</span></div><div class="d pos">▲ +$32.8 vs Real · ▼ −$4.3 vs Plan</div></div>
       <div class="it"><div class="l">Total ingresos Fcst</div><div class="v">$492.8<span style="font-size:14px;color:#9a9b90"> MDP</span></div><div class="d neg">▼ −$8.7 vs Plan 2026</div></div>
     </div>
   </div>
   <div class="divh"><span class="n">$</span>Indicadores del año</div>
   <div class="kpis">
     ${kpi('Total Ingresos',money(ing[3]),'MDP',ing[3],ing[2],ing[1])}
     ${kpi('Contribución Bruta',money(cb[3]),'MDP',cb[3],cb[2],cb[1])}
     ${kpi('Contribución Neta',money(cn[3]),'MDP',cn[3],cn[2],cn[1])}
     ${kpiPt('Margen Neto',pct(mgFcst,1),mgFcst,mgPlan,mgReal)}
   </div>
   <div class="card cpad" style="margin-top:16px">
     <div class="chead"><span class="t">Contribución neta mensual · Fcst 2026</span><span class="k">barras MDP · línea % margen</span></div>
     <div id="ch-resumen"></div>
     <div class="legend"><span><i style="width:11px;height:11px;background:var(--ink);border-radius:2px;display:inline-block"></i>Contribución neta</span>
       <span><i style="width:11px;height:11px;background:var(--neg);border-radius:2px;display:inline-block"></i>Mes negativo</span>
       <span><i style="width:14px;height:3px;background:var(--lime-deep);display:inline-block"></i>% margen</span></div>
   </div>
   <div class="card cpad" style="margin-top:16px">
     <div class="chead"><span class="t">Señales que exigen decisión</span><span class="k">2026</span></div>
     <div class="g2b" style="align-items:start">
       ${signal('Sobre-gasto vs capacidad',money(pf.dif)+' / mes','El presupuesto de gastos ('+pct(pf.gastoPct,1)+') excede la capacidad de gasto ideal Profit First ('+pct(pf.capPct,1)+').',pf.dif>=0?'pos':'neg')}
       ${signal('Servicio en rojo','POP · Fullfilment','Fullfilment opera con rentabilidad negativa (−32.8%); POP/Impresos al 9.1% diluye margen.','neg')}
       ${signal('Motores de margen','Trade · BTL · Eventos','Trade rinde 45.6% y BTL aporta $15.5 MDP: concentrar capacidad ahí.','pos')}
       ${signal('Ingresos externos por debajo','$28.5 vs $65.0 plan','La mezcla externa quedó −56% bajo plan: dependencia del Grupo aún alta.','neg')}
     </div>
   </div>`;
  setTimeout(()=>{const c=$('#ch-resumen',v);if(c){c.innerHTML=comboChart(M_CN,M_MG,MES,{h:230});wireCombo(c,M_CN,M_MG,MES);}},0);
  return v;
}
function kpi(l,val,unit,fc,plan,real){return `<div class="kpi"><div class="l">${l}</div><div class="v">${val}<u>${unit}</u></div><div class="deltas">${deltaTag(fc,plan,'Plan')}${deltaTag(fc,real,'Real')}</div></div>`;}
function kpiPt(l,val,fc,plan,real){return `<div class="kpi"><div class="l">${l}</div><div class="v">${val}</div><div class="deltas">
  <span class="dd ${fc-plan>=0?'pos':'neg'}">${fc-plan>=0?'▲':'▼'} ${ptsDelta((fc-plan)*100)} pts <span class="cap">vs Plan</span></span>
  <span class="dd ${fc-real>=0?'pos':'neg'}">${fc-real>=0?'▲':'▼'} ${ptsDelta((fc-real)*100)} pts <span class="cap">vs Real</span></span></div></div>`;}
function signal(t,big,desc,tone){return `<div style="display:flex;gap:13px;padding:11px 0;border-bottom:1px solid var(--line)">
  <span class="dot" style="margin-top:6px;background:var(--${tone==='pos'?'pos':'neg'})"></span>
  <div><div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap"><b style="font-size:13.5px">${t}</b>
  <span class="mono ${tone==='pos'?'pos':'neg'}" style="font-size:12px;font-weight:700">${big}</span></div>
  <div style="font-size:12px;color:var(--muted);margin-top:2px">${desc}</div></div></div>`;}

function vPL(){
  const v=el('div','view');
  let rows='';
  PL.forEach(r=>{const cls=(r[4]==='sum'||r[4]==='gross'||r[4]==='net')?'sum':'';const dP=r[3]-r[2],dR=r[3]-r[1];
    rows+=`<tr class="${cls}"><td>${r[0]}</td><td>${money(r[1])}</td><td>${money(r[2])}</td><td><b>${money(r[3])}</b></td>
      <td class="${dP>=0?'pos':'neg'}">${dP>=0?'+':'−'}${Math.abs(dP).toFixed(1)}</td>
      <td class="${dR>=0?'pos':'neg'}">${dR>=0?'+':'−'}${Math.abs(dR).toFixed(1)}</td></tr>`;});
  const bridge=[['Total Ingresos',492.78,'var(--ink)'],['Costos Totales',-307.81,'var(--neg)'],['Contribución Bruta',184.97,'var(--lime-deep)'],['Total Gastos',-82.16,'var(--neg)'],['Contribución Neta',102.81,'var(--lime-deep)']];
  v.innerHTML=`
   ${aiBar('el Estado de Resultados (P&L)')}
   <div class="g2">
     <div class="card cpad">
       <div class="chead"><span class="t">Estado de resultados · Marketing United</span><span class="k">MDP</span></div>
       <table class="tbl"><thead><tr><th>Concepto</th><th>Real 2025</th><th>Plan 2026</th><th>Fcst 2026</th><th>Δ Plan</th><th>Δ Real</th></tr></thead><tbody>${rows}</tbody></table>
       <div class="note">Δ verde = mejora la contribución (más ingreso o menos costo). La columna Fcst del libro es captura manual (amarillo): puedo hacerla editable también si lo necesitas.</div>
     </div>
     <div>
       <div class="card cpad"><div class="chead"><span class="t">Puente de resultado · Fcst 2026</span><span class="k">MDP</span></div>${hbar(bridge,{})}</div>
       <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">Estructura del peso facturado</span><span class="k">Fcst</span></div>${stackBar()}</div>
     </div>
   </div>
   <div class="divh"><span class="n">+</span>Estructura corporativa asignada · Staff 26</div>
   <div class="g2b" style="align-items:start">
     <div class="card cpad"><div class="chead"><span class="t">Gastos de estructura (Grupo)</span><span class="k">MDP</span></div>
       <table class="tbl"><thead><tr><th>Concepto</th><th>Real 2025</th><th>Plan 2026</th><th>Fcst 2026</th></tr></thead>
       <tbody>${STAFF.map(s=>`<tr><td>${s[0]}</td><td>${money(s[1])}</td><td>${money(s[2])}</td><td><b>${money(s[3])}</b></td></tr>`).join('')}
       <tr class="sum"><td>Total estructura</td><td>${money(STAFF_TOT[0])}</td><td>${money(STAFF_TOT[1])}</td><td>${money(STAFF_TOT[2])}</td></tr></tbody></table></div>
     <div class="card cpad"><div class="chead"><span class="t">Top costos de estructura · Fcst</span><span class="k">MDP</span></div>
       ${hbar(STAFF.slice(0,6).map(s=>[s[0],s[3],'var(--ink)']),{})}
       <div class="note">Personal concentra el 75% del costo de estructura. De aquí se asignan los $17.5 MDP de "Gastos Staff" del P&L de MU.</div></div>
   </div>`;
  return v;
}
function aiBar(topic){return `<div class="aiwrap" style="margin-bottom:16px">
   <div style="display:flex;justify-content:flex-end">
     <button class="aibtn" data-topic="${topic}">✦ Análisis profundo</button>
   </div>
   <div class="aipanel" style="display:none;margin-top:12px"></div></div>`;}
function aiPayload(){
  const serv=S.uen.map(u=>{const c=cUEN(u);return{servicio:u.name,ventas:u.ventas,costoPct:u.costoPct,rentabilidadAbs:c.rentAbs,rentabilidadPct:c.rentPct,categoria:u.cat};});
  return {
    moneda:'MDP (millones de pesos)',escenario:'Fcst 2026 vs Plan 2026 vs Real 2025',
    estadoResultados:PL.map(r=>({concepto:r[0],real2025:r[1],plan2026:r[2],fcst2026:r[3]})),
    serviciosUnitEconomics:serv,
    paretoClientes:S.pareto.map(p=>({cliente:p.name,ventaMiles:p.venta})),
    profitFirst:cPF(),
    estructuraStaff:STAFF.map(s=>({concepto:s[0],real2025:s[1],plan2026:s[2],fcst2026:s[3]})),
    capacidadHH:cCap(),
  };
}
function mdToHtml(md){
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/`(.+?)`/g,'<span class="mono">$1</span>');
  const out=[];let list=null;
  md.split(/\r?\n/).forEach(line=>{
    const l=line.trim();
    if(!l){if(list){out.push('</'+list+'>');list=null;}return;}
    const ord=/^\d+\.\s+(.*)/.exec(l);
    if(/^#{2,3}\s+/.test(l)){if(list){out.push('</'+list+'>');list=null;}out.push('<h4 class="aih">'+inline(l.replace(/^#{2,3}\s+/,''))+'</h4>');}
    else if(/^[-*]\s+/.test(l)){if(list!=='ul'){if(list)out.push('</'+list+'>');out.push('<ul class="ail">');list='ul';}out.push('<li>'+inline(l.replace(/^[-*]\s+/,''))+'</li>');}
    else if(ord){if(list!=='ol'){if(list)out.push('</'+list+'>');out.push('<ol class="ail">');list='ol';}out.push('<li>'+inline(ord[1])+'</li>');}
    else{if(list){out.push('</'+list+'>');list=null;}out.push('<p>'+inline(l)+'</p>');}
  });
  if(list)out.push('</'+list+'>');
  return out.join('');
}
function stackBar(){const ing=492.78,cost=307.81,gas=82.16,net=102.81;
  const seg=[['Costos directos',cost/ing,'var(--ink)'],['Gastos operativos',gas/ing,'var(--muted)'],['Contribución neta',net/ing,'var(--lime)']];
  return `<div style="display:flex;height:30px;border-radius:7px;overflow:hidden;border:1px solid var(--line)">${seg.map(s=>`<span style="width:${(s[1]*100).toFixed(1)}%;background:${s[2]};height:100%;display:block"></span>`).join('')}</div>
    <div class="legend" style="margin-top:10px">${seg.map(s=>`<span style="display:flex;align-items:center;gap:6px"><i style="width:11px;height:11px;background:${s[2]};border-radius:2px;display:inline-block"></i>${s[0]} · ${(s[1]*100).toFixed(0)}%</span>`).join('')}</div>`;}

function profitChart(p){
  const over=p.gastoAct>p.cap;
  const items=[
    ['Utilidad apartada',p.util,'#1E8F5E',p.capPct!=null?p.util/(p.ingreso||1):0],
    ['Capacidad de gasto',p.cap,'#C7E84A',p.capPct],
    ['Gasto actual',p.gastoAct,over?'#D8472F':'#EDEDE6',p.gastoPct],
  ];
  const W=760,H=270,pl=16,pr=16,pt=30,pb=48,iw=W-pl-pr,ih=H-pt-pb,n=items.length,gw=iw/n,bw=gw*0.40;
  const max=Math.max(...items.map(i=>i[1]),1)*1.18,base=pt+ih,y=val=>pt+ih*(1-Math.max(val,0)/max);
  let g=`<line x1="${pl}" x2="${pl+iw}" y1="${base}" y2="${base}" stroke="#2b2b27" stroke-width="1"/>`;
  // línea de referencia: capacidad de gasto (para ver el sobre-gasto de un vistazo)
  const yc=y(p.cap);
  g+=`<line x1="${pl}" x2="${pl+iw}" y1="${yc.toFixed(1)}" y2="${yc.toFixed(1)}" stroke="#C7E84A" stroke-width="1" stroke-dasharray="4 4" opacity=".4"/>`;
  items.forEach((it,i)=>{const cx=pl+gw*i+gw/2,x=cx-bw/2,yy=y(it[1]);
    g+=`<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${(base-yy).toFixed(1)}" rx="4" fill="${it[2]}"/>`;
    const lblCol=it[2]==='#EDEDE6'?'#EDEDE6':it[2];
    g+=`<text x="${cx.toFixed(1)}" y="${(yy-19).toFixed(1)}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="15" font-weight="700" fill="${lblCol}">${money(it[1])}</text>`;
    g+=`<text x="${cx.toFixed(1)}" y="${(yy-7).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" fill="#9a9b90">${pct(it[3],1)}</text>`;
    g+=`<text x="${cx.toFixed(1)}" y="${(base+18).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" fill="#74756c">${it[0]}</text>`;});
  // etiqueta de diferencia
  const diffCol=over?'#D8472F':'#1E8F5E';
  g+=`<text x="${(pl+iw).toFixed(1)}" y="${(pt-10).toFixed(1)}" text-anchor="end" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700" fill="${diffCol}">${over?'Sobre-gasto':'Holgura'} ${money(Math.abs(p.dif))} MDP</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">${g}</svg>`;
}
function vProfit(){
  const p=cPF();const v=el('div','view');
  const ladder=[['Ventas',p.ingreso,'var(--ink)'],['− Costos',-p.costo,'var(--neg)'],['= Capacidad de gasto',p.cap,'var(--lime-deep)']];
  v.innerHTML=`
   <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
     <div class="sectsub">El método Profit First invierte la fórmula: la utilidad no es lo que sobra, es lo que se aparta primero. Edita los <b>supuestos en verde</b> y el modelo recalcula la capacidad de gasto y la diferencia.</div>${editBadge}</div>
   <div class="g2">
     <div class="card cpad"><div class="chead"><span class="t">Presupuesto mensual</span><span class="k">MDP</span></div>
       <table class="tbl"><tbody>
         <tr><td>Ingreso total / Ventas</td><td>${inp('pf.ingreso',p.ingreso,'num',74)}</td><td class="mono" style="color:var(--muted)">100%</td></tr>
         <tr class="sub"><td>Costo de ventas (promedio)</td><td>${money(-p.costo)}</td><td>${inp('pf.costoPct',S.pf.costoPct,'pct',58)}</td></tr>
         <tr><td>Utilidad antes de impuestos esperada</td><td><b>${money(p.util)}</b></td><td>${inp('pf.utilPct',S.pf.utilPct,'pct',58)}</td></tr>
         <tr class="sum"><td>Capacidad de gasto en el mes</td><td>${money(p.cap)}</td><td class="mono">${pct(p.capPct,1)}</td></tr>
         <tr><td>Presupuesto de gastos actual</td><td>${inp('pf.gastoAct',p.gastoAct,'num',74)}</td><td class="mono">${pct(p.gastoPct,2)}</td></tr>
         <tr style="background:rgba(216,71,47,.06)"><td><b>Diferencia (sobre-gasto)</b></td><td class="${p.dif>=0?'pos':'neg'}"><b>${money(p.dif)}</b></td><td class="mono ${p.dif>=0?'pos':'neg'}"><b>${pct(p.difPct,2)}</b></td></tr>
       </tbody></table></div>
     <div>
       <div class="card cpad" style="border-color:${p.dif>=0?'var(--pos)':'var(--neg)'};border-width:1.5px">
         <div class="eyebrow" style="color:${p.dif>=0?'var(--pos)':'var(--neg)'}">Diagnóstico</div>
         <div style="font-family:var(--disp);font-weight:600;font-size:34px;letter-spacing:-.02em;margin:8px 0 2px">${money(p.dif)} <span style="font-size:18px;color:var(--muted)">MDP / mes</span></div>
         <div style="font-size:13px;color:var(--muted)">Marketing United gasta <b>${pct(p.gastoPct,1)}</b> de las ventas cuando su capacidad sana de gasto es <b>${pct(p.capPct,1)}</b>. ${p.dif<0?'Cada mes consume '+money(-p.dif)+' MDP que deberían ser utilidad.':'Hay holgura de '+money(p.dif)+' MDP sobre la capacidad de gasto.'}</div>
       </div>
       <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">Cascada Profit First</span><span class="k">MDP</span></div>${hbar(ladder,{max:p.ingreso})}</div>
     </div>
   </div>
   <div class="card cpad" style="margin-top:16px;background:#0B0B0C;border-color:#232320;position:relative;overflow:hidden">
     <div style="position:absolute;right:-70px;top:-80px;width:280px;height:280px;background:radial-gradient(circle,rgba(211,255,0,.14),transparent 65%);pointer-events:none"></div>
     <div class="chead" style="margin-bottom:6px"><span class="t" style="color:#fff">Capacidad de gasto vs. lo que se gasta</span><span class="k" style="color:#74756c">en vivo · MDP / mes</span></div>
     <div style="font-size:12px;color:#9a9b90;margin-bottom:6px">Se mueve al editar los supuestos en verde. La línea punteada marca la <b style="color:#C7E84A">capacidad de gasto</b>: si el gasto actual la supera, hay sobre-gasto.</div>
     ${profitChart(p)}</div>`;
  return v;
}

const SEM={v:['var(--pos)','Verde'],a:['var(--warn)','Amarillo'],r:['var(--neg)','Rojo'],g:['var(--gray)','Sin dato']};
function vUEN(){
  const v=el('div','view');
  let tVent=0,tD=0,tMC=0;
  let rows=S.uen.map((u,i)=>{const c=cUEN(u);const s=SEM[c.sem];tVent+=u.ventas;tD+=c.D;tMC+=(c.mcAbs||0);
    const ptoEq=(c.mcPct&&c.mcPct>0)?u.gastoFijo/c.mcPct:null;
    return `<tr>
      <td><span class="dot" style="background:${s[0]}"></span><span class="edname" contenteditable="true" spellcheck="false" data-bind="uen.${i}.name">${u.name}</span></td>
      <td>${inp('uen.'+i+'.ventas',u.ventas,'num',60)}</td>
      <td>${inp('uen.'+i+'.costoPct',u.costoPct,'pct',54)}</td>
      <td>${inp('uen.'+i+'.gastoFijo',u.gastoFijo,'num',56)}</td>
      <td>${c.D?money(c.D):'—'}</td>
      <td class="${c.rentAbs==null?'':(c.rentAbs>=0?'pos':'neg')}"><b>${c.rentAbs==null?'—':money(c.rentAbs)}</b></td>
      <td>${c.rentPct==null?'—':pct(c.rentPct,1)}</td>
      <td>${ptoEq==null?'—':money(ptoEq)}</td>
      <td><span class="tag" style="color:${s[0]};border-color:${s[0]}">${s[1]}</span></td>
      <td><span class="mono" style="font-size:10px;color:var(--muted)">${u.cat}</span></td></tr>`;}).join('');
  const comp=S.uen.map(u=>({u,c:cUEN(u)}));
  const bars=comp.filter(x=>x.c.rentAbs!=null).map(x=>[x.u.name,x.c.rentAbs,SEM[x.c.sem][0]]).sort((a,b)=>b[1]-a[1]);
  const verdes=comp.filter(x=>x.c.sem==='v').map(x=>x.u.name);
  const amar=comp.filter(x=>x.c.sem==='a').map(x=>x.u.name);
  const rojos=comp.filter(x=>x.c.sem==='r').map(x=>x.u.name);
  const insight=(lbl,col,names,desc)=>`<div class="card cpad" style="border-top:3px solid ${col}">
     <div class="eyebrow" style="color:${col}">${lbl}</div>
     <div style="font-family:var(--disp);font-weight:600;font-size:17px;margin:6px 0 6px">${names.length?names.join(' · '):'—'}</div>
     <div style="font-size:12px;color:var(--muted)">${desc}</div></div>`;
  v.innerHTML=`
   ${aiBar('Unit Economics por Servicio')}
   <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
     <div class="sectsub">¿Marketing United gana dinero en todo lo que vende? Edita <b>ventas, % de costo directo y costo fijo asignado</b>; rentabilidad, punto de equilibrio y semáforo recalculan solos.</div>${editBadge}</div>
   <div class="card cpad">
     <div class="chead"><span class="t">Rentabilidad por Servicio</span><span class="k">MDP · semáforo automático</span></div>
     <table class="tbl"><thead><tr><th>Servicio</th><th>Ventas</th><th>% Costo</th><th>C. fijo</th><th>C. directos</th><th>Rentab. $</th><th>Rentab. %</th><th>Pto. Eq.</th><th>Diag.</th><th>Categoría</th></tr></thead>
     <tbody>${rows}<tr class="sum"><td>Total</td><td>${money(tVent)}</td><td></td><td></td><td>${money(tD)}</td><td>${money(tMC-S.fGastoPropio*comp.filter(x=>x.u.ventas>0).length)}</td><td></td><td></td><td></td><td></td></tr></tbody></table>
     <div class="note">Semáforo automático: Verde ≥ 20% · Amarillo 10–20% · Rojo &lt; 10% de rentabilidad. Rentab. $ = Ventas − Costos directos − Gasto propio ($${S.fGastoPropio.toFixed(2)} MDP/Servicio). Pto. Eq. = Costo fijo ÷ margen de contribución.</div>
   </div>
   <div class="g2" style="margin-top:16px">
     <div class="card cpad"><div class="chead"><span class="t">Rentabilidad $ por Servicio</span><span class="k">ordenado</span></div>${hbar(bars,{})}
       <div class="legend" style="margin-top:14px"><span><i class="dot" style="background:var(--pos)"></i>Verde · motor sano</span>
       <span><i class="dot" style="background:var(--warn)"></i>Amarillo · vigilar</span><span><i class="dot" style="background:var(--neg)"></i>Rojo · drena margen</span></div></div>
     <div class="g3" style="grid-template-columns:1fr">
       ${insight('Motores de margen','var(--pos)',verdes,'Rentabilidad ≥ 20%. Aquí vive el dinero: concentrar capacidad en estas unidades.')}
       ${insight('Bajo control','var(--warn)',amar,'Margen de contribución sano pero rentabilidad &lt; 20% por carga de gasto propio. Vigilar costeo.')}
       ${insight('Fuga de margen','var(--neg)',rojos,'Rentabilidad &lt; 10% o negativa. Renegociar costos o salir.')}
     </div>
   </div>`;
  return v;
}

function driverChart(b){
  const pres=b[4],real=b[5],band=b[7],fmt=b[3];
  const show=v=>fmt==='pct'?pct(v,1):fmt==='x'?v.toFixed(1)+'x':fmt==='mdp'?'$'+v.toFixed(1):v.toFixed(1);
  const W=1000,H=240,pl=24,pr=24,pt=30,pb=30,iw=W-pl-pr,ih=H-pt-pb;
  const all=[...pres,...real.filter(x=>x!=null),...band];
  let mn=Math.min(...all),mx=Math.max(...all);if(mn===mx){mx+=1;mn-=1;}
  const pad=(mx-mn)*0.22;mn-=pad;mx+=pad;
  const n=Math.max(pres.length,5),X=i=>pl+iw*i/(n-1),Y=v=>pt+ih*((mx-v)/(mx-mn));
  // zona KPI
  let g=`<rect x="${pl}" y="${Y(band[1]).toFixed(1)}" width="${iw}" height="${Math.abs(Y(band[0])-Y(band[1])).toFixed(1)}" fill="rgba(199,232,74,.32)"/>`;
  [band[1],band[0]].forEach((bv,k)=>{g+=`<line x1="${pl}" x2="${pl+iw}" y1="${Y(bv).toFixed(1)}" y2="${Y(bv).toFixed(1)}" stroke="#5A6E00" stroke-width="1" stroke-dasharray="4 4" opacity=".6"/>`;
    g+=`<text x="${(pl+iw-2).toFixed(1)}" y="${(Y(bv)+(k?12:-4)).toFixed(1)}" text-anchor="end" font-family="'JetBrains Mono',monospace" font-size="9.5" fill="#5A6E00">${show(bv)}</text>`;});
  // eje meses
  MES.forEach((m,i)=>{g+=`<text x="${X(i).toFixed(1)}" y="${(H-9).toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9.5" fill="#9A9B91">${m}</text>`;});
  // líneas + puntos (presupuesto y real a mayo)
  g+=`<polyline points="${pres.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}" fill="none" stroke="#0B0B0C" stroke-width="2"/>`;
  pres.forEach((v,i)=>{g+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" fill="#0B0B0C"/>`;});
  const pts=real.map((v,i)=>v==null?null:X(i).toFixed(1)+','+Y(v).toFixed(1)).filter(Boolean).join(' ');
  if(pts)g+=`<polyline points="${pts}" fill="none" stroke="#D8472F" stroke-width="2" stroke-dasharray="5 3"/>`;
  real.forEach((v,i)=>{if(v==null)return;g+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.9" fill="#D8472F"/>`;});
  // etiquetas: el valor más alto va arriba y el más bajo abajo para que no se encimen; halo blanco para legibilidad
  const lbl=(x,y,txt,col,w)=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="${w}" fill="${col}" paint-order="stroke" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round">${txt}</text>`;
  pres.forEach((pv,i)=>{const rv=real[i];
    if(rv==null){g+=lbl(X(i),Y(pv)-9,show(pv),'#0B0B0C',600);return;}
    const pHi=pv>=rv;
    g+=lbl(X(i),Y(pv)+(pHi?-9:17),show(pv),'#0B0B0C',600);
    g+=lbl(X(i),Y(rv)+(pHi?17:-9),show(rv),'#D8472F',700);});
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">${g}</svg>`;
}
function vDrivers(){
  const v=el('div','view');let cards='';
  const legend=`<div class="legend" style="margin-top:10px;font-size:10px"><span><i style="width:14px;height:2px;background:var(--ink);display:inline-block"></i>Presupuesto</span>
      <span><i style="width:14px;height:2px;background:var(--neg);display:inline-block"></i>Real a mayo</span><span><i style="width:12px;height:10px;background:rgba(199,232,74,.55);display:inline-block"></i>Zona KPI</span></div>`;
  BD.forEach(b=>{
    const head=(extra)=>`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:10px">
        <div><div class="num">DRIVER ${b[0]}</div><h4 style="margin:3px 0 3px">${b[1]}</h4><div class="q" style="min-height:0">${b[2]}</div></div>
        <div style="text-align:right;flex:0 0 auto">${extra}</div></div>`;
    if(b[0]==='07'){cards+=`<div class="bd" style="display:block">
      ${head(`<div style="font-family:var(--disp);font-weight:700;font-size:28px;letter-spacing:-.02em">30–60</div><div class="mono" style="font-size:10px;color:var(--muted)">días · objetivo</div>`)}
      <div style="height:120px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12.5px;text-align:center;background:rgba(199,232,74,.10);border-radius:8px">Capturar días por mes según Balance General · (CxC días − CxP días) — KPI: ${b[6]}</div></div>`;return;}
    const fmt=b[3],last=b[4][b[4].length-1];
    const show=v=>fmt==='pct'?pct(v,1):fmt==='x'?v.toFixed(1)+'x':fmt==='mdp'?'$'+v.toFixed(1):v.toFixed(1);
    cards+=`<div class="bd" style="display:block">
      ${head(`<div style="font-family:var(--disp);font-weight:700;font-size:28px;letter-spacing:-.02em">${show(last)}</div><div class="mono" style="font-size:10px;color:var(--muted)">presup. dic · meta ${b[6]}</div>`)}
      ${driverChart(b)}${legend}</div>`;});
  v.innerHTML=`${aiBar('los Business Drivers')}<div class="sectsub" style="margin-bottom:18px">Siete preguntas de negocio convertidas en indicador. Cada gráfica muestra el presupuesto mensual, el real a mayo y la zona KPI objetivo, con la cifra en cada punto.</div><div style="display:flex;flex-direction:column;gap:16px">${cards}</div>`;
  return v;
}

function vComercial(){
  const v=el('div','view');
  const pTot=S.pareto.reduce((a,b)=>a+b.venta,0);let cum=0;
  const pRows=S.pareto.map((p,i)=>{const pc=pTot?p.venta/pTot:0;cum+=pc;
    return `<tr><td>${p.name}</td><td>${inp('pareto.'+i+'.venta',p.venta,'int',72)}</td><td>${pct(pc,1)}</td><td class="mono" style="color:var(--muted)">${pct(cum,1)}</td></tr>`;}).join('');
  const top3=S.pareto.slice(0,3).reduce((a,b)=>a+b.venta,0),top3pct=pTot?top3/pTot:0;
  const cacRows=S.cac.map((c,i)=>{const cac=c.proy?c.inv/c.proy:null;
    return `<tr><td>${c.name}</td><td>${inp('cac.'+i+'.inv',c.inv,'int',96)}</td><td>${inp('cac.'+i+'.proy',c.proy,'int',54)}</td>
      <td>${cac==null?'—':'$'+Math.round(cac).toLocaleString('en-US')}</td>
      <td><span class="tag" style="color:${c.cal==='Alta'?'var(--pos)':c.cal==='Baja'?'var(--neg)':'var(--muted)'}">${c.cal}</span></td></tr>`;}).join('');
  const ltvRows=S.ltv.map((l,i)=>{const ltv=l.ticket*l.proy*l.al2030*l.margen;
    return `<tr><td>${l.name}</td><td>${inp('ltv.'+i+'.ticket',l.ticket,'int',96)}</td><td>${inp('ltv.'+i+'.proy',l.proy,'int',54)}</td>
      <td>${inp('ltv.'+i+'.al2030',l.al2030,'int',46)}</td><td>${inp('ltv.'+i+'.margen',l.margen,'pct',54)}</td>
      <td><b>$${(ltv/1e6).toFixed(1)}M</b></td></tr>`;}).join('');
  const ltvBars=S.ltv.map(l=>[l.name,l.ticket*l.proy*l.al2030*l.margen/1e6,'var(--ink)']).sort((a,b)=>b[1]-a[1]);
  v.innerHTML=`
   ${aiBar('el Modelo Comercial')}
   <div style="display:flex;justify-content:flex-end;margin-bottom:14px">${editBadge}</div>
   <div class="g2">
     <div class="card cpad"><div class="chead"><span class="t">Pareto de clientes</span><span class="k">venta acumulada · miles</span></div>
       <table class="tbl"><thead><tr><th>Cliente</th><th>Venta (k)</th><th>% total</th><th>Acum.</th></tr></thead>
       <tbody>${pRows}<tr class="sum"><td>Total</td><td>${(pTot/1000).toFixed(1)}</td><td>100%</td><td></td></tr></tbody></table>
       <div class="note">Los 3 clientes mayores concentran el <b>${pct(top3pct,0)}</b> de la venta: ${top3pct>=0.7?'alta dependencia.':'concentración moderada.'}</div></div>
     <div class="card cpad"><div class="chead"><span class="t">LTV por tipo de cliente</span><span class="k">millones de pesos</span></div>${hbar(ltvBars,{fmt:v=>'$'+v.toFixed(0)+'M'})}
       <div class="note">Enfocar ventas en clientes de mayor LTV, no solo mayor ticket.</div></div>
   </div>
   <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">LTV por cliente · editable</span><span class="k">ticket × proyectos × años × margen</span></div>
     <table class="tbl"><thead><tr><th>Cliente</th><th>Ticket promedio</th><th>Proyectos/año</th><th>Años</th><th>Margen %</th><th>LTV</th></tr></thead><tbody>${ltvRows}</tbody></table></div>
   <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">CAC por canal de prospección</span><span class="k">CAC = inversión ÷ proyectos</span></div>
     <table class="tbl"><thead><tr><th>Canal</th><th>Inversión</th><th>Proyectos</th><th>CAC</th><th>Calidad fuente</th></tr></thead><tbody>${cacRows}</tbody></table>
     <div class="note">Grupo Salinas y CoMarketing traen el CAC más bajo con alta calidad. Marketing Corporativo cuesta más por proyecto con baja calidad: candidato a recortar.</div></div>
   <div class="card cpad" style="margin-top:16px"><div class="chead"><span class="t">Cuellos de botella comerciales · acción Lean Kaizen</span><span class="k">por etapa</span></div>
     <table class="tbl"><thead><tr><th>Paso</th><th style="text-align:left">Problema</th><th style="text-align:left">Impacto</th><th style="text-align:left">Acción Kaizen</th></tr></thead>
     <tbody>${BOTTLE.map(b=>`<tr><td>${b[0]}</td><td style="text-align:left;font-family:var(--sans);font-weight:400">${b[1]}</td>
       <td style="text-align:left;font-family:var(--sans);font-weight:400;color:var(--muted)">${b[2]}</td>
       <td style="text-align:left;font-family:var(--sans);font-weight:400"><span class="chiplim">${b[3]}</span></td></tr>`).join('')}</tbody></table></div>`;
  return v;
}

function vOperativo(){
  const v=el('div','view');const totDias=S.vsm.reduce((a,b)=>a+b.dias,0);
  const heat=val=>`<span class="h" style="background:${val>=4?'var(--neg)':val>=3?'var(--warn)':val>=2?'var(--lime-deep)':'var(--line-2)'}"></span>`;
  const steps=S.vsm.map((s,i)=>`<div class="vstep" ${s.cli?'style="border-color:var(--warn)"':''}>
      <div class="n">PASO ${s.n}${s.cli?' · cliente':''}</div><div class="nm">${s.paso}</div>
      <div class="d">${inp('vsm.'+i+'.dias',s.dias,'int',40)} <span style="font-size:10px;color:var(--muted)">d</span></div>
      <div style="font-size:9px;color:var(--muted);margin-top:4px">${s.areas}</div>
      <div class="heat" title="cuello · retrabajo · RRHH">${heat(s.cuello)}${heat(s.retrab)}${heat(s.rrhh)}</div></div>`).join('');
  v.innerHTML=`
   ${aiBar('el Modelo Operativo Kaizen')}
   <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">
     <div class="sectsub">Flujo de valor (VSM) de lead a medición. Edita los <b>días por paso</b> y el ciclo total recalcula. El brief y los ajustes son donde el cliente interviene.</div>${editBadge}</div>
   <div class="card cpad"><div class="chead"><span class="t">Flujo operativo · 11 pasos</span><span class="k">ciclo total ${totDias} días hábiles</span></div>
     <div class="vsm">${steps}</div>
     <div class="legend" style="margin-top:12px"><span>Indicadores por paso (cuello · retrabajo · carga RRHH):</span>
     <span><i class="h" style="width:14px;height:6px;display:inline-block;border-radius:3px;background:var(--line-2)"></i>bajo</span>
     <span><i class="h" style="width:14px;height:6px;display:inline-block;border-radius:3px;background:var(--warn)"></i>medio</span>
     <span><i class="h" style="width:14px;height:6px;display:inline-block;border-radius:3px;background:var(--neg)"></i>alto</span></div></div>
   <div class="g2" style="margin-top:16px">
     <div class="card cpad"><div class="chead"><span class="t">Días por paso</span><span class="k">días hábiles</span></div>
       ${hbar(S.vsm.map(s=>[s.paso,s.dias,s.dias>=5?'var(--neg)':'var(--ink)']),{fmt:v=>v+'d'})}
       <div class="note">Producción y los pasos de creativo/cotización son los mayores consumidores de tiempo. Ciclo total: <b>${totDias} días</b>.</div></div>
     <div class="card cpad"><div class="eyebrow">Gate obligatorio del sistema</div>
       <div style="font-family:var(--disp);font-weight:600;font-size:22px;margin:8px 0 10px">BRIEF · freno ante el caos del cliente</div>
       ${gate('Calidad','¿Exactamente qué necesitas y para qué?','Resumen claro y ejecutable')}
       ${gate('Tiempo','¿Para cuándo lo necesitas?','Plazo real para cotizar e implementar')}
       ${gate('Costo','¿Cuánto presupuesto vas a destinar?','Rango mínimo y máximo definido')}
       <div class="note">No avanza al siguiente paso si el brief no cumple los tres gates.</div></div>
   </div>`;
  return v;
}
function gate(t,q,need){return `<div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid var(--line)">
  <span class="chiplim" style="height:fit-content">${t}</span><div><div style="font-size:12.5px;font-weight:500">${q}</div>
  <div style="font-size:11px;color:var(--muted)">→ ${need}</div></div></div>`;}

function vCapacidad(){
  const v=el('div','view');const c=cCap();const cap=S.cap;
  const fmtHH=x=>(x/1000).toFixed(0)+'k HH';
  v.innerHTML=`
   ${aiBar('la Capacidad instalada (Horas-Hombre)')}
   <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px">
     <div class="sectsub">La capacidad es inventario que se vence cada día: lo que no se vende, se pierde. Edita los <b>insumos</b> y el embudo y los costos recalculan.</div>${editBadge}</div>
   <div class="card cpad" style="margin-bottom:16px"><div class="chead"><span class="t">Insumos del modelo</span><span class="k">captura</span></div>
     <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px">
       ${insumo('Personas (headcount)',inp('cap.headcount',cap.headcount,'int',58))}
       ${insumo('Días hábiles / año',inp('cap.dias',cap.dias,'int',58))}
       ${insumo('Horas efectivas / día',inp('cap.horas',cap.horas,'num',54))}
       ${insumo('% ineficiencia',inp('cap.inef',cap.inef,'pct',54))}
       ${insumo('% utilización (vendida)',inp('cap.util',cap.util,'pct',54))}
       ${insumo('Costo por HH ($)',inp('cap.costoHH',cap.costoHH,'int',96))}
     </div></div>
   <div class="g2">
     <div class="card cpad"><div class="chead"><span class="t">Embudo de capacidad</span><span class="k">horas-hombre / año</span></div>
       <div class="funnel">
         <div class="fbar"><div class="fill" style="width:100%;background:var(--ink);color:var(--lime)">INSTALADA</div><div class="lab" style="color:var(--lime)">${fmtHH(c.inst)}</div></div>
         <div class="fbar"><div class="fill" style="width:${(c.act/c.inst*100)}%;background:var(--lime)">ACTUAL</div><div class="lab">${fmtHH(c.act)} · ${pct(c.act/c.inst,0)}</div></div>
         <div class="fbar"><div class="fill" style="width:${(c.vend/c.inst*100)}%;background:var(--paper-2);border:1px solid var(--line-2)">VENDIDA</div><div class="lab">${fmtHH(c.vend)} · ${pct(c.vend/c.inst,0)}</div></div>
       </div>
       <div class="legend" style="margin-top:14px"><span><i class="dot" style="background:var(--ink)"></i>Instalada: techo teórico al 100%</span><span><i class="dot" style="background:var(--lime)"></i>Actual: tras descontar ineficiencia</span></div></div>
     <div class="g2b" style="grid-template-columns:1fr 1fr">
       ${capCost('Inversión en capacidad instalada',bigPeso(c.invInst),'Lo que cuesta tener el equipo completo al 100%.','var(--ink)')}
       ${capCost('Valor de la capacidad actual',bigPeso(c.valAct),'Lo que el equipo realmente puede producir.','var(--lime-deep)')}
       ${capCost('Costo de la ineficiencia',bigPeso(c.costoInef),'Capacidad que pagas pero vacaciones, festivos y tiempos muertos se comen.','var(--neg)')}
       ${capCost('Costo de la capacidad ociosa',bigPeso(c.costoOciosa),'Equipo pagado y disponible que no se ha logrado vender.','var(--neg)')}
     </div>
   </div>`;
  return v;
}
function insumo(t,inputHtml){return `<div><div class="mono" style="font-size:9.5px;letter-spacing:.04em;color:var(--muted);text-transform:uppercase;margin-bottom:6px;min-height:24px">${t}</div>${inputHtml}</div>`;}
function cinput(t,inputHtml){return `<div><div class="mono" style="font-size:9.5px;letter-spacing:.04em;color:#9a9b90;text-transform:uppercase;margin-bottom:6px;min-height:24px">${t}</div>${inputHtml}</div>`;}
function capCost(t,big,d,col){return `<div class="card cpad" style="border-left:3px solid ${col}">
  <div class="eyebrow">${t}</div><div style="font-family:var(--disp);font-weight:600;font-size:24px;letter-spacing:-.02em;margin:6px 0 4px;color:${col}">${big}</div>
  <div style="font-size:11.5px;color:var(--muted)">${d}</div></div>`;}

const RENDER={resumen:vResumen,pl:vPL,profit:vProfit,uen:vUEN,drivers:vDrivers,comercial:vComercial,operativo:vOperativo,capacidad:vCapacidad};

/* =================== NAV / REACTIVITY / BOOT =================== */
function go(name,keepScroll){
  CUR=name;
  ROOT.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===name));
  const m=META[name];$('.vtitle').textContent=m[0];$('.vsub').textContent=m[1];
  const sy=keepScroll?window.scrollY:0;
  const host=$('.views');host.innerHTML='';host.appendChild(RENDER[name]());
  $('.side').classList.remove('open');
  if(keepScroll)window.scrollTo({top:sy,behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});
}
function recalc(){go(CUR,true);}
ROOT.addEventListener('change',e=>{
  const t=e.target;if(!t.classList||!t.classList.contains('inp'))return;
  let val=parseFloat(String(t.value).replace(/,/g,''));if(isNaN(val))val=0;
  if(t.dataset.t==='pct')val=val/100;
  const path=t.dataset.bind.split('.');let o=S;
  for(let j=0;j<path.length-1;j++)o=o[path[j]];
  o[path[path.length-1]]=val;
  recalc();
});
ROOT.addEventListener('focusout',e=>{
  const t=e.target;if(!t.classList||!t.classList.contains('edname'))return;
  const val=(t.textContent||'').trim()||'Servicio';
  const path=t.dataset.bind.split('.');let o=S;
  for(let j=0;j<path.length-1;j++)o=o[path[j]];
  if(o[path[path.length-1]]===val)return;
  o[path[path.length-1]]=val;recalc();
});
ROOT.addEventListener('keydown',e=>{
  const t=e.target;if(t.classList&&t.classList.contains('edname')&&e.key==='Enter'){e.preventDefault();t.blur();}
});
ROOT.addEventListener('click',async e=>{
  const btn=e.target.closest?e.target.closest('.aibtn'):null;if(!btn||btn.disabled)return;
  const wrap=btn.closest('.aiwrap'),panel=wrap&&wrap.querySelector('.aipanel');if(!panel)return;
  const topic=btn.dataset.topic||'el negocio',label=btn.textContent;
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
$('.brandchip').innerHTML=uMark('#C7E84A',24);
setIcons();
go('resumen');


  return () => { ROOT.innerHTML = ''; };
}
