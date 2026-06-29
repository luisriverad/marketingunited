/**
 * Vercel Serverless Function — análisis de IA con Groq (capa gratuita).
 * Se ejecuta en /api/analyze tanto en local (`npm run dev`, vía Vite) como en
 * el sitio publicado en Vercel. La API key vive solo en el servidor:
 *   Vercel → Settings → Environment Variables → GROQ_API_KEY
 */
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(400).json({
      error:
        'Falta GROQ_API_KEY. Agrégala en Vercel → Settings → Environment Variables y vuelve a desplegar.',
    })
    return
  }
  try {
    const payload =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const topic: string = payload?.topic || 'el negocio'
    const empresa: string = payload?.empresa || 'Marketing United'
    const mode: string = payload?.mode || 'analysis'
    const data = payload?.payload ?? payload

    const PLAN_SYS =
      `Eres consultor de operaciones y mejora continua (Lean Kaizen) de ${empresa}, una agencia de marketing B2B. ` +
      'Escribe en español, ejecutivo y accionable, en formato markdown. ' +
      'Genera un PLAN DE TRABAJO a 90 días para resolver los cuellos de botella comerciales del payload. ' +
      'Divídelo EXACTAMENTE en tres horizontes, cada uno con su encabezado "## ": "## 0–30 días", "## 31–60 días" y "## 61–90 días". ' +
      'En cada horizonte usa viñetas "- " con acciones concretas; por cada acción indica entre paréntesis el responsable sugerido y en **negrita** el resultado esperado o métrica. ' +
      'Encadena los horizontes con lógica (quick wins primero, estandarización después, escala/medición al final). ' +
      'Sé conciso: máximo ~450 palabras en total.'
    const BRIEF_SYS =
      `Eres director de estrategia/planning senior de ${empresa}, una agencia de marketing B2B. ` +
      "Tu trabajo es convertir las notas crudas de un cliente que a menudo 'no sabe bien qué quiere' en un BRIEF EJECUTABLE, a prueba de retrabajo. " +
      'A partir del borrador (JSON), redacta un brief profesional en español, en markdown, con estas secciones EXACTAS con "## ": ' +
      'Resumen ejecutivo; Objetivo de negocio y KPI; Público objetivo; Mensaje clave y propuesta de valor; Entregables y especificaciones; ' +
      'Tiempos e hitos; Presupuesto; Mandatorios y restricciones; Criterios de éxito y medición; Cadena de aprobación; Preguntas para cerrar ambigüedades. ' +
      'Reglas: donde el cliente dejó huecos, propón supuestos inteligentes y márcalos como **(supuesto a validar)**; sé específico y accionable, sin relleno; ' +
      'si falta presupuesto o fecha, dilo explícito en "Preguntas para cerrar". Máximo ~500 palabras.'
    const EVAL_SYS =
      `Eres director de estrategia/planning senior de ${empresa}, agencia de marketing B2B, experto en evitar retrabajo. ` +
      'Te entregan el TEXTO de un brief de cliente (puede venir incompleto o desordenado). Evalúalo con ojo crítico. ' +
      'Responde en español, en markdown, con estas secciones EXACTAS con "## ": ' +
      'Veredicto (¿listo para avanzar? Sí / No / Con reservas, en una línea); ' +
      'Semáforo por gate (Calidad, Tiempo, Costo — usa 🟢/🟡/🔴 con razón breve cada uno); ' +
      'Fallas y ambigüedades; Faltantes críticos (lo que impide cotizar o ejecutar); ' +
      'Áreas de riesgo (dónde se generará retrabajo si avanza así); ' +
      'Preguntas para el cliente (lista priorizada para cerrar huecos). ' +
      'Sé concreto y exigente pero útil; parafrasea partes del brief al señalar un problema. Máximo ~500 palabras.'
    const ANALYSIS_SYS =
      `Eres el CFO/analista de negocio de ${empresa}, una agencia de marketing B2B. ` +
      'Cifras en MDP (millones de pesos). ' +
      'Escribe en español, directo y ejecutivo, con formato markdown: usa encabezados "## ", ' +
      'viñetas "- " y **negritas** para cifras clave. Sé concreto y apóyate en los números reales del payload. ' +
      'Estructura el análisis en: Diagnóstico, Riesgos principales, Palancas de valor, y Recomendaciones accionables (con prioridad). ' +
      'Sé conciso: máximo ~400 palabras en total.'
    const REACCION_SYS =
      `Eres asesor de estrategia y riesgos del CEO de ${empresa}, agencia de marketing B2B. ` +
      'Te entrego TODO el documento de planeación en JSON: el cierre financiero 2026 (cierre2026), el plan Rumbo al 2030 (rumbo2030) ' +
      'y el módulo de Riesgos / prácticas antifrágiles (riesgos). Léelo en conjunto y propón PLANES DE REACCIÓN ANTICIPATORIA ' +
      '(decidir antes del shock, no reaccionar después). Markdown, secciones EXACTAS con "## ": ' +
      'Lectura del documento (3-5 viñetas con los riesgos sistémicos que conectan los 3 módulos, citando cifras concretas: concentración de clientes, margen, CCC/caja, capacidad HH); ' +
      'Señales a vigilar (cada una con su umbral observable); ' +
      'Planes de reacción anticipatoria (para cada riesgo: **Disparador** observable → reacción preaprobada → dueño → cuándo); ' +
      'Movimientos sin arrepentimiento (acciones a iniciar ya, pase lo que pase). ' +
      'Sé concreto y apóyate en los números reales del payload. Máximo ~550 palabras.'
    const system = mode === 'plan' ? PLAN_SYS : mode === 'brief' ? BRIEF_SYS : mode === 'evaluacion' ? EVAL_SYS : mode === 'reaccion' ? REACCION_SYS : ANALYSIS_SYS

    const PLAN_USER =
      `Construye el plan de trabajo 30·60·90 para los cuellos de botella comerciales de ${empresa}. ` +
      'Cada cuello trae su paso, problema, impacto y la acción Kaizen propuesta: conviértelos en tareas calendarizadas por horizonte.\n\n' +
      'Datos (JSON):\n' +
      JSON.stringify(data)
    const BRIEF_USER =
      `Convierte este borrador en un brief ejecutable para ${empresa}. Rellena los huecos con supuestos inteligentes marcados como supuesto a validar.\n\n` +
      'Borrador del brief (JSON):\n' +
      JSON.stringify(data)
    const EVAL_USER =
      'Evalúa este brief de cliente con sentido crítico. Detecta fallas, faltantes y áreas de riesgo de retrabajo.\n\n' +
      'Texto del brief (JSON):\n' +
      JSON.stringify(data)
    const ANALYSIS_USER =
      `Analiza a profundidad **${topic}** de ${empresa}. ` +
      'Identifica de dónde viene el valor o la fuga, qué decisiones tomar y con qué prioridad. ' +
      'Si algún dato no aplica al tema, úsalo solo como contexto.\n\n' +
      'Datos (JSON):\n' +
      JSON.stringify(data)
    const REACCION_USER =
      `Evalúa todo el documento de ${empresa} (los 3 módulos) y entrega el plan de reacción anticipatoria.\n\n` +
      'Documento completo (JSON):\n' +
      JSON.stringify(data)
    const user = mode === 'plan' ? PLAN_USER : mode === 'brief' ? BRIEF_USER : mode === 'evaluacion' ? EVAL_USER : mode === 'reaccion' ? REACCION_USER : ANALYSIS_USER

    const body = JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1600,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })
    const call = () =>
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body,
      })

    let r = await call()
    if (r.status === 429) {
      const wait = Math.min(9, Math.ceil(Number(r.headers.get('retry-after')) || 6))
      await new Promise((res2) => setTimeout(res2, wait * 1000))
      r = await call()
    }
    const json: any = await r.json()
    if (!r.ok) {
      if (r.status === 429) {
        res.status(429).json({
          error: 'Estás generando muchos análisis muy seguido. Espera unos segundos y vuelve a intentar.',
        })
        return
      }
      res.status(r.status).json({ error: json?.error?.message || `Error ${r.status} de Groq` })
      return
    }
    const text = json?.choices?.[0]?.message?.content || ''
    res.status(200).json({ text: text || '(Groq no devolvió análisis)' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: message })
  }
}
