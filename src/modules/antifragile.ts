// @ts-nocheck
/* eslint-disable */
/**
 * Marketing United — módulo "antifragile".
 * Controlador autónomo: inyecta su layout (sidebar + top bar + vistas) en ROOT
 * y ejecuta su motor reactivo (estado, cálculos y render). Todo el manejo de
 * eventos está delegado a ROOT, así cada módulo es independiente.
 * Powered by AXON B2B.
 */
const BODY = `<div class="app">
  <aside class="side">
    <div class="brand">
      <div class="chip brandchip"></div>
      <div class="wm"><b>Marketing United</b><span>Empresa Antifrágil 2030</span></div>
    </div>
    <div class="navlbl">Sistema</div>
    <nav class="nav">
      <a data-v="resumen" class="on"><span class="ic" data-i="shield"></span>Las 9 prácticas</a>
      <a data-v="sistema"><span class="ic" data-i="loop"></span>Sistema antifrágil 2030</a>
    </nav>
    <div class="navlbl">Diagnóstico de riesgo</div>
    <nav class="nav">
      <a data-v="sesgo"><span class="ic" data-i="scope"></span>Sesgo de predicción</a>
      <a data-v="pavo"><span class="ic" data-i="turkey"></span>Síndrome del pavo</a>
      <a data-v="negros"><span class="ic" data-i="bolt"></span>Cisnes negros</a>
      <a data-v="blancos"><span class="ic" data-i="eye"></span>Cisnes blancos</a>
    </nav>
    <div class="navlbl">Diseño antifrágil</div>
    <nav class="nav">
      <a data-v="opcion"><span class="ic" data-i="dice"></span>Opcionalidad estratégica</a>
      <a data-v="redund"><span class="ic" data-i="layers"></span>Redundancias inteligentes</a>
      <a data-v="skin"><span class="ic" data-i="hand"></span>Skin in the game</a>
    </nav>
    <div class="navlbl">Operación</div>
    <nav class="nav">
      <a data-v="playbooks"><span class="ic" data-i="book"></span>Playbooks de reacción</a>
    </nav>
    <div class="foot">
      <div class="pw">Powered by AXON B2B</div>
    </div>
  </aside>
  <div class="main">
    <header class="top">
      <button class="menubtn" aria-label="Menú"><span class="ic" data-i="shield" style="color:var(--ink)"></span></button>
      <div><h1 class="vtitle">Las 9 prácticas</h1><div class="sub vsub">Empresa Antifrágil rumbo a 2030</div></div>
      <div class="spacer"></div>
      <div class="pill">Rumbo a 2030</div>
    </header>
    <div class="views"></div>
  </div>
</div>`;

export function createAntifragile(ROOT: HTMLElement): () => void {
  ROOT.innerHTML = BODY;

/* ============ DATA (10 pestañas del libro Antifrágil) ============ */
const PRAC=[
 ['sesgo','02','Sesgo de Predicción','Separar crecimiento real del asumido','Lista de supuestos críticos a validar','risk'],
 ['pavo','03','Síndrome del Pavo','Detectar falsas seguridades que pueden romperse de golpe','Mapa de falsas seguridades y acciones','risk'],
 ['negros','04','Cisnes Negros','Preparar respuesta a shocks imprevisibles de alto impacto','Playbook de eventos extremos','risk'],
 ['blancos','05','Cisnes Blancos','Atacar riesgos visibles que ya se conocen','Tablero de riesgos con umbrales','risk'],
 ['opcion','06','Opcionalidad Estratégica','Apuestas pequeñas con pérdida limitada y aprendizaje rápido','Portafolio de apuestas controladas','bet'],
 ['redund','07','Redundancias Inteligentes','Eliminar puntos únicos de falla sin inflar estructura','Mapa de redundancias críticas','bet'],
 ['skin','08','Skin in the Game','Asignar dueños, beneficios y consecuencias por resultado','Sistema de accountability','bet'],
 ['playbooks','09','Playbooks de Reacción','Respuestas preaprobadas para escenarios de velocidad','Manual de respuesta rápida','sys'],
 ['sistema','10','Sistema Antifrágil 2030','Convertir señales y aprendizajes en rutina de decisión','Antifragility Operating System','sys'],
];
const DATA={
 sesgo:{n:'02',title:'Sesgo de Predicción',intro:'Separar crecimiento real de crecimiento asumido. Validar que el pasado no esté inflando el plan 2030.',sec:'Supuestos críticos a validar',
   cols:['Supuesto 2030','Dato que lo soporta','Riesgo de error','Prueba Kaizen','Acción'],edit:[4],
   rows:[
    ['Ventas crecerán al ritmo histórico','Histórico de ventas y pipeline','El cliente o mercado ya no se comporta igual','Comparar ventas por cliente, Servicio y margen','Ajustar meta o cambiar mix'],
    ['Grupo Salinas seguirá comprando','Ventas actuales / recurrencia','Dependencia excesiva','Medir % Top 3 y ventas externas','Definir meta de diversificación'],
    ['Los Servicios actuales escalan','Capacidad y margen actuales','Escalan ventas, no rentabilidad','Simular margen y HH 2030','Rediseñar o limitar Servicios'],
    ['La estructura aguanta crecimiento','Headcount actual','Saturación y cuellos de botella','Medir HH disponibles vs requeridas','Contratar, automatizar o tercerizar'],
   ]},
 pavo:{n:'03',title:'Síndrome del Pavo',intro:'Identificar falsas seguridades: cosas que funcionaron hasta hoy, pero pueden romperse de golpe.',sec:'Falsas seguridades',
   cols:['Lo que ha funcionado','Lo que asumimos','Qué lo puede romper','Señal temprana','Plan'],edit:[4],
   rows:[
    ['Dependencia de cliente grande','Seguirá comprando','Cambio de presupuesto o dirección','Menos pedidos / mayor presión de precio','Diversificar ventas'],
    ['Cultura de resolver todo','Siempre podremos sacar la chamba','Saturación, errores, burnout','Retrabajo y urgencias crecientes','Gates y capacidad por Servicio'],
    ['Crecimiento por respuesta rápida','La velocidad compensa el desorden','Margen bajo y fallas operativas','Más trabajo con menos utilidad','Estandarizar procesos'],
    ['Talento clave heroico','Las personas clave siempre estarán','Salida o fatiga del talento','Concentración de decisiones','Backups y SOPs'],
   ]},
 negros:{n:'04',title:'Cisnes Negros',intro:'Preparar respuesta a shocks inesperados de alto impacto, aunque no se pueda predecir su fecha.',sec:'Shocks y respuesta',risk:true,
   cols:['Shock','Impacto probable','Respuesta 72 horas','Respuesta 30 días','Dueño'],edit:[4],phases:{2:['ph72','72 HORAS'],3:['ph30','30 DÍAS']},
   rows:[
    ['Caída abrupta de cliente clave','Ingreso y caja','Congelar gastos no críticos','Activar pipeline alterno','CEO / Comercial'],
    ['Crisis reputacional en evento','Marca, clientes, legal','Comité de crisis y vocero','Auditoría y nuevo protocolo','Operación / Legal'],
    ['Falla crítica de proveedor','Ejecución y margen','Activar proveedor backup','Homologar red de proveedores','Operación'],
    ['Salida de talento clave','Capacidad y conocimiento','Asignar backup inmediato','Documentar proceso y sucesión','Talento / Servicio'],
    ['Shock de liquidez','Pagos, proveedores, nómina','Priorizar caja y cobranza','Renegociar plazos y costos','Finanzas'],
   ]},
 blancos:{n:'05',title:'Cisnes Blancos',intro:'Atacar riesgos visibles que ya se conocen y que no deben sorprender a nadie.',sec:'Riesgos visibles y umbrales',
   cols:['Riesgo visible','Indicador temprano','Prevención','Trigger de acción','Dueño'],edit:[3,4],
   rows:[
    ['Concentración Grupo Salinas','% ventas Top 3','Meta de clientes externos','Top 3 > límite definido','Comercial'],
    ['Compresión de margen','Margen por Servicio','Pricing y costeo obligatorio','Margen < mínimo','Finanzas / Servicio'],
    ['Saturación operativa','HH demandadas vs disponibles','Plan de capacidad','Uso > 85% sostenido','Operación'],
    ['Retraso de cobranza','DSO / CCC','Condiciones de pago y anticipos','DSO > meta','Finanzas'],
    ['Obsolescencia tecnológica','% procesos manuales','Roadmap IA y data','Retrabajo o decisiones lentas','Data / IA'],
   ]},
 opcion:{n:'06',title:'Opcionalidad Estratégica',intro:'Crear apuestas pequeñas con pérdida limitada y aprendizaje rápido.',sec:'Apuestas controladas',
   cols:['Apuesta','Costo máximo','Aprendizaje esperado','Criterio para escalar','Criterio para matar'],edit:[3,4],
   rows:[
    ['Nuevo Servicio piloto','Presupuesto controlado','Demanda, margen, capacidad','3 clientes / margen mínimo','No hay venta o margen'],
    ['Canal comercial nuevo','CAC máximo definido','Calidad de leads','LTV/CAC > 3','CAC alto sin cierre'],
    ['Automatización operativa','Horas de implementación','Ahorro HH y retrabajo','Ahorro medible','No se adopta'],
    ['Alianza estratégica','Tiempo comercial limitado','Acceso a clientes nuevos','Pipeline rentable','Sin leads calificados'],
    ['Producto repetible','Desarrollo mínimo viable','Recompra y escalabilidad','Venta recurrente','Demasiada personalización'],
   ]},
 redund:{n:'07',title:'Redundancias Inteligentes',intro:'Eliminar puntos únicos de falla sin inflar estructura innecesaria.',sec:'Puntos únicos de falla',
   cols:['Área','Punto único de falla','Redundancia mínima','Nivel requerido','Acción'],edit:[4],
   rows:[
    ['Talento','Una persona sabe ejecutar','Backup entrenado','2 personas por proceso crítico','Documentar y capacitar'],
    ['Proveedores','Proveedor único','Proveedor alterno validado','2 opciones por categoría','Homologar red'],
    ['Clientes','Ingreso concentrado','Pipeline externo','Límite de concentración','Diversificar'],
    ['Procesos','Operación tácita','SOP / checklist','Proceso documentado','Estandarizar'],
    ['Caja','Cobranza lenta','Reserva mínima','Meses de operación definidos','Regla de caja'],
    ['Data','Información dispersa','Dashboard único','Fuente confiable','Integrar datos'],
   ]},
 skin:{n:'08',title:'Skin in the Game',intro:'Asignar dueños reales, beneficios y consecuencias por resultado.',sec:'Dueño · KPI · Consecuencia',
   cols:['Iniciativa','Dueño','KPI','Beneficio','Consecuencia'],edit:[1],
   rows:[
    ['Rentabilidad por Servicio','Líder Servicio','Margen / EBITDA','Bono por mejora','Revisión de rol'],
    ['Diversificación de clientes','Comercial','Ventas externas / Top 3','Incentivo por cliente rentable','Recorte de canal ineficiente'],
    ['Disciplina operativa','PM / Operación','Gates / Q-t-$','Reconocimiento por cumplimiento','No iniciar sin gate'],
    ['Productividad del talento','RH / Servicio','Revenue per employee / HH','Plan de crecimiento','Reasignación o salida'],
    ['IA y automatización','Data / IA Ops','Horas ahorradas','Prioridad de inversión','Eliminar herramienta no usada'],
   ]},
 playbooks:{n:'09',title:'Playbooks de Reacción',intro:'Definir respuestas preaprobadas para escenarios que requieren velocidad.',sec:'Respuesta rápida por escenario',
   cols:['Escenario','Decisión 24 horas','Acción 7 días','Acción 30 días','Dueño'],edit:[4],phases:{1:['ph24','24 HORAS'],2:['ph7','7 DÍAS'],3:['ph30','30 DÍAS']},
   rows:[
    ['Cae cliente grande','Congelar gasto variable','Activar pipeline y cobranza','Rediseñar forecast','CEO / Finanzas'],
    ['Baja el margen','Detener cotizaciones bajo mínimo','Revisar precios y costos','Eliminar oferta no rentable','Finanzas / Servicio'],
    ['Operación saturada','Priorizar proyectos rentables','Redistribuir HH','Contratar / tercerizar / automatizar','Operación'],
    ['Sale talento clave','Activar backup','Documentar proceso','Plan de sucesión','Talento'],
    ['Cobranza se atrasa','Escalar CxC crítica','Renegociar pagos','Cambiar términos comerciales','Finanzas'],
    ['Oportunidad grande','Validar margen y capacidad','Armar célula temporal','Convertir en Servicio o producto','CEO / Servicio'],
   ]},
 sistema:{n:'10',title:'Sistema Antifrágil 2030',intro:'Convertir riesgos, señales y aprendizajes en una rutina de decisión mensual.',sec:'Rutina de decisión',
   cols:['Señal a monitorear','Umbral','Decisión','Frecuencia','Dueño'],edit:[1,3],
   rows:[
    ['Concentración Top 3','Arriba del límite','Acelerar diversificación','Mensual','Comercial'],
    ['Margen por Servicio','Debajo del mínimo','Renegociar o detener oferta','Mensual','Finanzas / Servicio'],
    ['CCC / DSO','Arriba de meta','Cambiar condiciones de pago','Mensual','Finanzas'],
    ['Utilización HH','Muy alta o muy baja','Redistribuir, contratar o automatizar','Quincenal','Operación / Talento'],
    ['Retrabajo','Arriba de meta','Kaizen de causa raíz','Mensual','PM / Operación'],
    ['Adopción IA','Baja adopción','Reentrenar o eliminar herramienta','Mensual','Data / IA'],
    ['Iniciativas 2030','Retraso crítico','Escalar decisión ejecutiva','Quincenal','Dirección'],
   ]},
};

/* ============ HELPERS ============ */
const $=(s,e=ROOT)=>e.querySelector(s);
const ICON={
 shield:'<path d="M9.5 1.5l6 2.2v5.5c0 4-2.7 6.4-6 7.8-3.3-1.4-6-3.8-6-7.8V3.7z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
 loop:'<path d="M4 7a6 6 0 019-3.5M15 12a6 6 0 01-9 3.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13 2.5V5.5H10M6 16.5V13.5H9" fill="none" stroke="currentColor" stroke-width="1.4"/>',
 scope:'<circle cx="9.5" cy="9.5" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 1.5v4M9.5 13.5v4M1.5 9.5h4M13.5 9.5h4" stroke="currentColor" stroke-width="1.3"/>',
 turkey:'<circle cx="11" cy="10" r="3.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 9.5l-3-1M8 11l-3 1.4M14.2 8.6c2-2 3-1.5 3.2-.4M14.2 11.4c2 2 3 1.5 3.2.4" fill="none" stroke="currentColor" stroke-width="1.2"/>',
 bolt:'<path d="M10.5 1.5L4 10.5h4l-1.5 7L14 8h-4z" fill="currentColor"/>',
 eye:'<path d="M1.5 9.5S4.5 4 9.5 4s8 5.5 8 5.5-3 5.5-8 5.5-8-5.5-8-5.5z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="9.5" cy="9.5" r="2.3"/>',
 dice:'<rect x="2.5" y="2.5" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="6.5" cy="6.5" r="1.2"/><circle cx="12.5" cy="12.5" r="1.2"/><circle cx="9.5" cy="9.5" r="1.2"/>',
 layers:'<path d="M9.5 2l7 4-7 4-7-4z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 10l7 4 7-4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
 hand:'<path d="M6 9V4.5a1.3 1.3 0 012.6 0V8m0-.5V3.5a1.3 1.3 0 012.6 0V8m0-1V4.5a1.3 1.3 0 012.6 0V11c0 3-2 5.5-5 5.5-2 0-3.2-1-4.5-2.7L4 11.5c-.6-.9.6-2 1.5-1.3z" fill="none" stroke="currentColor" stroke-width="1.3"/>',
 book:'<path d="M3 3.5h5a2 2 0 012 2v10a2 2 0 00-2-2H3z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M16 3.5h-5a2 2 0 00-2 2v10a2 2 0 012-2h5z" fill="none" stroke="currentColor" stroke-width="1.3"/>',
};
function setIcons(){ROOT.querySelectorAll('[data-i]').forEach(s=>{s.innerHTML=`<svg viewBox="0 0 19 19" width="100%" height="100%" fill="currentColor">${ICON[s.dataset.i]||''}</svg>`;});}
function uMark(fill,size){return `<svg width="${size}" height="${size*1.08}" viewBox="0 0 100 108"><path d="M6 0 L6 60 Q6 104 50 104 Q94 104 94 60 L94 0 L50 40 Z" fill="${fill}"/></svg>`;}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// payload del módulo Riesgos (las 9 prácticas, con sus filas actuales)
function riesgosPayload(){return Object.keys(DATA).map(k=>({practica:DATA[k].title,seccion:DATA[k].sec,columnas:DATA[k].cols,filas:DATA[k].rows}));}
// documento completo: los 3 módulos (lee lo que publican Cierre 2026 y Rumbo 2030 en window)
function documentoCompleto(){
  const safe=fn=>{try{return typeof fn==='function'?fn():null;}catch(_){return null;}};
  return {cierre2026:safe(window.__MU_cierre),rumbo2030:safe(window.__MU_rumbo),riesgos:riesgosPayload()};
}
function mdToHtml(md){
  const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inline=s=>e(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>');
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

/* ============ RENDERERS ============ */
const META={resumen:['Las 9 prácticas','Empresa Antifrágil rumbo a 2030'],sistema:['Sistema antifrágil 2030','Rutina de decisión · Antifragility Operating System']};
PRAC.forEach(p=>{if(p[0]!=='sistema')META[p[0]]=[p[2],DATA[p[0]].intro];});

function tableCard(key){
 const d=DATA[key];
 const head=d.cols.map(c=>`<th>${c}</th>`).join('');
 const body=d.rows.map((r,ri)=>`<tr>${r.map((cell,ci)=>{
   let inner=esc(cell);
   if(d.phases&&d.phases[ci]){const ph=d.phases[ci];inner=`<span class="phase ${ph[0]}">${ph[1]}</span><div>${esc(cell)}</div>`;}
   if(d.edit&&d.edit.includes(ci)){inner=`<span class="ed edbox" contenteditable="true" data-view="${key}" data-r="${ri}" data-c="${ci}">${esc(cell)}</span>`;}
   return `<td>${inner}</td>`;}).join('')}</tr>`).join('');
 return `<div class="tcard"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function practiceView(key){
 const d=DATA[key];const v=document.createElement('div');v.className='view';
 const isRisk=['negros','blancos','pavo','sesgo'].includes(key);
 v.innerHTML=`
  <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;margin-bottom:18px">
    <div style="flex:1;min-width:300px">
      <div class="${isRisk?'eyebrowrisk':'eyebrow'}">${isRisk?'Diagnóstico de riesgo':'Diseño antifrágil'} · Práctica ${d.n}</div>
      <div class="sectsub" style="margin-top:8px;max-width:760px">${d.intro}</div>
    </div>
    <span class="editbadge"><i></i>Campos de acción editables · adáptalos en sesión</span>
  </div>
  <div class="chead" style="margin-bottom:10px"><span class="t">${d.sec}</span><span class="k">${d.rows.length} filas</span></div>
  ${tableCard(key)}
  ${key==='playbooks'?granCierre():''}`;
 return v;
}
function granCierre(){
 return `<div class="card cpad" style="margin-top:20px;border:1.5px solid var(--ink);background:linear-gradient(180deg,#fbfbf7,#f3f6ec)">
   <div class="chead"><span class="t">Plan de reacción anticipatoria</span><span class="k">evalúa los 3 módulos</span></div>
   <div class="sectsub" style="margin:0 0 12px;max-width:820px">El cierre de todo el documento. El sistema lee <b>Cierre 2026</b>, <b>Rumbo al 2030</b> y <b>Riesgos</b> juntos, conecta las amenazas sistémicas y propone <b>planes de reacción anticipatoria</b>: qué vigilar, qué decidir <i>antes</i> del shock, quién y cuándo.</div>
   <button class="addbtn" data-act="gran-cierre">✦ Generar plan de reacción anticipatoria</button>
   <div class="aipanel granpanel" style="display:none;margin-top:16px"></div>
 </div>`;
}
function vSistema(){
 const d=DATA.sistema;const v=document.createElement('div');v.className='view';
 const rows=d.rows.map((r,ri)=>`<div class="rrow">
   <div class="sig">${esc(r[0])}</div>
   <div class="umb"><span class="ed edbox" contenteditable="true" data-view="sistema" data-r="${ri}" data-c="1">${esc(r[1])}</span></div>
   <div class="dec">${esc(r[2])}</div>
   <div class="freq">${esc(r[3])}</div></div>`).join('');
 v.innerHTML=`
  <div class="sectsub" style="margin-bottom:18px;max-width:780px">${d.intro} Cada señal tiene un umbral, una decisión preaprobada y un dueño: cuando el umbral se cruza, la decisión ya está tomada.</div>
  <div class="routine">
    <div class="rhd"><span>Señal a monitorear</span><span>Umbral</span><span>Decisión preaprobada</span><span>Frecuencia</span></div>
    ${rows}
  </div>
  <div class="g3" style="margin-top:18px">
    ${sysCard('Mensual','Concentración, margen, CCC, retrabajo, adopción IA','El pulso de riesgo del negocio: cinco señales que se revisan cada mes.')}
    ${sysCard('Quincenal','Utilización HH · Iniciativas 2030','Lo que se mueve rápido: capacidad del equipo y avance de las apuestas.')}
    ${sysCard('La regla','Umbral cruzado = decisión tomada','La antifragilidad no es reaccionar mejor, es haber decidido antes del shock.')}
  </div>`;
 return v;
}
function sysCard(t,big,desc){return `<div class="card cpad"><div class="eyebrow">${t}</div>
  <div style="font-family:var(--disp);font-weight:600;font-size:16px;margin:7px 0 7px;line-height:1.2">${big}</div>
  <div style="font-size:12px;color:var(--muted)">${desc}</div></div>`;}

function vResumen(){
 const v=document.createElement('div');v.className='view';
 const cards=PRAC.map(p=>`<div class="prac ${p[5]}" data-go="${p[0]}"><span class="edge"></span>
   <div class="pn">${p[1]} · PRÁCTICA</div><h4>${p[2]}</h4><div class="pc">${p[3]}</div>
   <div class="pe">${p[4]}</div></div>`).join('');
 v.innerHTML=`
  <div class="hero" style="margin-bottom:22px">
    <div class="lead">Empresa Antifrágil 2030</div>
    <div class="big" style="font-size:46px;line-height:1.05">No predecir el futuro.<br><span style="color:var(--lime)">Estar listos para cualquier riesgo.</span></div>
    <div class="uline"></div>
    <div style="font-size:14px;color:#b9bab0;max-width:680px;margin-top:6px">Convertir riesgos, señales y aprendizajes en una rutina de decisión. Nueve prácticas que vuelven a Marketing United más fuerte con cada golpe, no más frágil.</div>
  </div>
  <div class="divh"><span class="n">9</span>Las 9 prácticas rumbo a 2030</div>
  <div class="pracgrid">${cards}</div>
  <div class="divh" style="margin-top:26px"><span class="n">↻</span>El sistema operativo</div>
  <div class="card cpad" style="display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;cursor:pointer" data-go="sistema">
    <div style="flex:1;min-width:280px"><div style="font-family:var(--disp);font-weight:600;font-size:20px;margin-bottom:6px">Sistema Antifrágil 2030</div>
      <div style="font-size:13px;color:var(--muted)">Las nueve prácticas aterrizan en una rutina de decisión mensual: siete señales, sus umbrales y la decisión ya preaprobada para cada una.</div></div>
    <span class="chiplim">Ver rutina de decisión →</span>
  </div>`;
 return v;
}

const RENDER={resumen:vResumen,sistema:vSistema};
PRAC.forEach(p=>{if(p[0]!=='sistema')RENDER[p[0]]=()=>practiceView(p[0]);});

/* ============ NAV / BOOT ============ */
let CUR='resumen';
function go(name){
 CUR=name;
 ROOT.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===name));
 const m=META[name]||['',''];$('.vtitle').textContent=m[0];$('.vsub').textContent=m[1];
 const host=$('.views');host.innerHTML='';host.appendChild(RENDER[name]());
 $('.side').classList.remove('open');window.scrollTo({top:0,behavior:'instant'});
}
ROOT.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>go(a.dataset.v)));
ROOT.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go);});
// Gran cierre: evalúa los 3 módulos y propone planes de reacción anticipatoria
ROOT.addEventListener('click',async e=>{
 const btn=e.target.closest?e.target.closest('[data-act="gran-cierre"]'):null;if(!btn||btn.disabled)return;
 const panel=$('.granpanel');if(!panel)return;
 const label=btn.textContent;btn.disabled=true;btn.textContent='Evaluando todo el documento…';
 panel.style.display='block';panel.innerHTML='<div class="aiload"><span class="aispin"></span>EVALUANDO LOS 3 MÓDULOS · PLAN DE REACCIÓN ANTICIPATORIA…</div>';
 try{
   const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'reaccion',empresa:'Marketing United',topic:'plan de reacción anticipatoria',payload:documentoCompleto()})});
   const raw=await r.text();let data=null;try{data=raw?JSON.parse(raw):{};}catch(_){data=null;}
   if(data===null)throw new Error(r.status===404?'La función /api/analyze no está desplegada (sube api/ y configura GROQ_API_KEY en Vercel).':'El servidor no devolvió JSON (código '+r.status+').');
   if(!r.ok)throw new Error(data.error||('Error '+r.status));
   panel.innerHTML='<div class="aihead"><span class="aibadge">✦ Plan de reacción anticipatoria · documento completo</span></div><div class="aibody">'+mdToHtml(data.text||'(sin respuesta)')+'</div>';
 }catch(err){panel.innerHTML='<div class="aierr">No se pudo generar el plan: '+(err&&err.message?err.message:err)+'</div>';}
 finally{btn.disabled=false;btn.textContent=label;}
});
ROOT.addEventListener('input',e=>{const t=e.target;if(!t.classList||!t.classList.contains('ed'))return;
  DATA[t.dataset.view].rows[+t.dataset.r][+t.dataset.c]=t.textContent;});
$('.menubtn').addEventListener('click',()=>$('.side').classList.toggle('open'));
$('.brandchip').innerHTML=uMark('#C7E84A',24);
setIcons();go('resumen');


  return () => { ROOT.innerHTML = ''; };
}
