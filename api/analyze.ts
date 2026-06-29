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

    const system =
      mode === 'plan'
        ? `Eres consultor de operaciones y mejora continua (Lean Kaizen) de ${empresa}, una agencia de marketing B2B. ` +
          'Escribe en español, ejecutivo y accionable, en formato markdown. ' +
          'Genera un PLAN DE TRABAJO a 90 días para resolver los cuellos de botella comerciales del payload. ' +
          'Divídelo EXACTAMENTE en tres horizontes, cada uno con su encabezado "## ": "## 0–30 días", "## 31–60 días" y "## 61–90 días". ' +
          'En cada horizonte usa viñetas "- " con acciones concretas; por cada acción indica entre paréntesis el responsable sugerido y en **negrita** el resultado esperado o métrica. ' +
          'Encadena los horizontes con lógica (quick wins primero, estandarización después, escala/medición al final). ' +
          'Sé conciso: máximo ~450 palabras en total.'
        : `Eres el CFO/analista de negocio de ${empresa}, una agencia de marketing B2B. ` +
          'Cifras en MDP (millones de pesos). ' +
          'Escribe en español, directo y ejecutivo, con formato markdown: usa encabezados "## ", ' +
          'viñetas "- " y **negritas** para cifras clave. Sé concreto y apóyate en los números reales del payload. ' +
          'Estructura el análisis en: Diagnóstico, Riesgos principales, Palancas de valor, y Recomendaciones accionables (con prioridad). ' +
          'Sé conciso: máximo ~400 palabras en total.'

    const user =
      mode === 'plan'
        ? `Construye el plan de trabajo 30·60·90 para los cuellos de botella comerciales de ${empresa}. ` +
          'Cada cuello trae su paso, problema, impacto y la acción Kaizen propuesta: conviértelos en tareas calendarizadas por horizonte.\n\n' +
          'Datos (JSON):\n' +
          JSON.stringify(data)
        : `Analiza a profundidad **${topic}** de ${empresa}. ` +
          'Identifica de dónde viene el valor o la fuga, qué decisiones tomar y con qué prioridad. ' +
          'Si algún dato no aplica al tema, úsalo solo como contexto.\n\n' +
          'Datos (JSON):\n' +
          JSON.stringify(data)

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
