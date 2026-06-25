import { useState } from 'react'
import Gate from './components/Gate'
import ModuleBar from './components/ModuleBar'
import ModuleHost from './components/ModuleHost'
import { createBudget2026 } from './modules/budget2026'
import { createRoadmap2030 } from './modules/roadmap2030'
import { createAntifragile } from './modules/antifragile'

const MODS = [
  { id: 'mod-2026', k: '01', t: 'Cierre 2026', create: createBudget2026 },
  { id: 'mod-2030', k: '02', t: 'Rumbo al 2030', create: createRoadmap2030 },
  { id: 'mod-ant', k: '03', t: 'Riesgos', create: createAntifragile },
]

export default function App() {
  const [active, setActive] = useState('mod-2026')
  const [entered, setEntered] = useState(false)

  if (!entered) {
    return (
      <Gate
        mods={MODS}
        onEnter={(id) => {
          setActive(id)
          setEntered(true)
        }}
      />
    )
  }

  return (
    <div className="ushell">
      <ModuleBar mods={MODS} active={active} onSelect={setActive} />
      {MODS.map((m) => (
        <ModuleHost key={m.id} id={m.id} create={m.create} active={active === m.id} />
      ))}
    </div>
  )
}
