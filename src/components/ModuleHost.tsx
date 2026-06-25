import { useEffect, useRef } from 'react'

interface Props {
  /** DOM id for the module root (e.g. "mod-2026"). */
  id: string
  /** Controller factory: receives the root element, returns a cleanup fn. */
  create: (root: HTMLElement) => () => void
  active: boolean
}

/**
 * Each of the three big modules is a self-contained controller that renders
 * its own sidebar, top bar and reactive views into a DOM node. ModuleHost is
 * the thin React boundary that mounts the controller once and toggles
 * visibility. The whole subtree is kept mounted so each module preserves its
 * internal state when you switch tabs.
 */
export default function ModuleHost({ id, create, active }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!ref.current || mounted.current) return
    mounted.current = true
    const cleanup = create(ref.current)
    return () => {
      if (cleanup) cleanup()
      mounted.current = false
    }
  }, [create])

  return <div ref={ref} id={id} className={'module' + (active ? '' : ' hidden')} />
}
