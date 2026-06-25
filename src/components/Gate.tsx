interface Mod {
  id: string
  k: string
  t: string
}

interface Props {
  mods: Mod[]
  onEnter: (id: string) => void
}

const U_MARK = (
  <svg width="34" height="37" viewBox="0 0 100 108" aria-hidden="true">
    <path
      d="M6 0 L6 60 Q6 104 50 104 Q94 104 94 60 L94 0 L50 40 Z"
      fill="#C7E84A"
    />
  </svg>
)

/**
 * Pantalla de entrada. Hace las veces de autenticación: sin usuario ni
 * contraseña, el acceso es elegir uno de los tres módulos. Al pulsar un botón
 * se "entra" y se abre ese módulo en el shell.
 */
export default function Gate({ mods, onEnter }: Props) {
  return (
    <div className="gate">
      <div className="gate-bg" aria-hidden="true" />
      <div className="gate-card">
        <div className="gate-brand">
          <span className="gate-u">{U_MARK}</span>
          <div className="gate-wm">
            <b>Marketing United</b>
            <span>Inteligencia de Negocio</span>
          </div>
        </div>

        <div className="gate-banner">
          <span className="gate-banner-lead">Growth</span>
          <b className="gate-banner-title">Marketing United 2030</b>
          <span className="gate-banner-sub">Visión 2026 — 2030</span>
        </div>

        <div className="gate-head">
          <span className="gate-eyebrow">Acceso</span>
          <h1 className="gate-title">¿Qué quieres revisar?</h1>
        </div>

        <div className="gate-btns">
          {mods.map((m) => (
            <button
              key={m.id}
              className="gate-btn"
              data-mod={m.id}
              onClick={() => onEnter(m.id)}
            >
              <span className="gb-k">{m.k}</span>
              <span className="gb-t">{m.t}</span>
              <span className="gb-go">Entrar →</span>
            </button>
          ))}
        </div>

        <div className="gate-foot">Powered by AXON B2B</div>
      </div>
    </div>
  )
}
