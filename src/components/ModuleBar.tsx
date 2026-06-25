interface Mod {
  id: string
  k: string
  t: string
}

interface Props {
  mods: Mod[]
  active: string
  onSelect: (id: string) => void
}

const U_MARK = (
  <svg width="26" height="28" viewBox="0 0 100 108" aria-hidden="true">
    <path
      d="M6 0 L6 60 Q6 104 50 104 Q94 104 94 60 L94 0 L50 40 Z"
      fill="#C7E84A"
    />
  </svg>
)

export default function ModuleBar({ mods, active, onSelect }: Props) {
  return (
    <header className="modbar">
      <div className="mbrand">
        <span className="mb-u">{U_MARK}</span>
        <div>
          <b>Marketing United</b>
          <span>Inteligencia de Negocio</span>
        </div>
      </div>
      <div className="modtabs">
        {mods.map((m) => (
          <button
            key={m.id}
            data-mod={m.id}
            className={'modtab' + (active === m.id ? ' on' : '')}
            onClick={() => onSelect(m.id)}
          >
            <span className="mt-k">{m.k}</span>
            <span className="mt-t">{m.t}</span>
          </button>
        ))}
      </div>
      <div className="mpw">Powered by AXON B2B</div>
    </header>
  )
}
