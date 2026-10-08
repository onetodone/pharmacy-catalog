import { lazy, type ComponentType } from 'react'

/**
 * `React.lazy` for modules with named exports: loads the module on first
 * render and uses the export called `name` as the component.
 */
export function lazyPage<M extends Record<K, ComponentType>, K extends keyof M>(
  load: () => Promise<M>,
  name: K,
) {
  return lazy(async () => ({ default: (await load())[name] }))
}
