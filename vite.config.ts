import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only endpoint que conecta el botón "Análisis profundo" con Groq
 * (capa gratuita, modelos Llama). La API key vive solo en el servidor
 * (archivo .env), el navegador nunca la ve. Funciona con `npm run dev`.
 *
 * Consigue una key gratis en https://console.groq.com/keys
 */
const GROQ_MODEL = 'llama-3.3-70b-versatile'

function aiAnalyze(apiKey: string): Plugin {
  return {
    name: 'mu-ai-analyze',
    configureServer(server) {
      server.middlewares.use('/api/analyze', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        const send = (code: number, obj: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        try {
          if (!apiKey) {
            send(400, {
              error:
                'Falta GROQ_API_KEY. Consigue una gratis en https://console.groq.com/keys, crea un archivo .env en la raíz con: GROQ_API_KEY=gsk_... y reinicia `npm run dev`.',
            })
            return
          }
          let raw = ''
          for await (const chunk of req) raw += chunk
          const payload = raw ? JSON.parse(raw) : {}

          const topic: string = payload?.topic || 'el negocio'
          const empresa: string = payload?.empresa || 'Marketing United'
          const data = payload?.payload ?? payload

          const system =
            `Eres el CFO/analista de negocio de ${empresa}, una agencia de marketing B2B. ` +
            'Cifras en MDP (millones de pesos). ' +
            'Escribe en español, directo y ejecutivo, con formato markdown: usa encabezados "## ", ' +
            'viñetas "- " y **negritas** para cifras clave. Sé concreto y apóyate en los números reales del payload. ' +
            'Estructura el análisis en: Diagnóstico, Riesgos principales, Palancas de valor, y Recomendaciones accionables (con prioridad). ' +
            'Sé conciso: máximo ~400 palabras en total.'

          const user =
            `Analiza a profundidad **${topic}** de ${empresa}. ` +
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
          // Reintento automático si topa el límite por minuto (espera lo que pide Groq, máx 9s).
          if (r.status === 429) {
            const wait = Math.min(9, Math.ceil(Number(r.headers.get('retry-after')) || 6))
            await new Promise((res) => setTimeout(res, wait * 1000))
            r = await call()
          }
          const json: any = await r.json()
          if (!r.ok) {
            if (r.status === 429) {
              send(429, {
                error:
                  'Estás generando muchos análisis muy seguido. Espera unos segundos y vuelve a intentar.',
              })
              return
            }
            send(r.status, { error: json?.error?.message || `Error ${r.status} de Groq` })
            return
          }
          const text = json?.choices?.[0]?.message?.content || ''
          send(200, { text: text || '(Groq no devolvió análisis)' })
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          send(500, { error: message })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carga .env (prefijo '' = todas las variables, no solo VITE_*).
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY || ''
  return {
    plugins: [react(), aiAnalyze(apiKey)],
    base: './',
  }
})
