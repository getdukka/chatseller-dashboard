// composables/useClickOutside.ts
import { type Ref, unref, type ComponentPublicInstance } from 'vue'

type MaybeRef<T> = T | Ref<T>
type MaybeElementRef = MaybeRef<Element | ComponentPublicInstance | undefined | null>

export function useClickOutside(
  targets: MaybeElementRef | MaybeElementRef[],
  handler: (event: Event) => void,
  options: {
    ignore?: MaybeElementRef[]
    capture?: boolean
    detectIframe?: boolean
  } = {}
) {
  const { ignore = [], capture = true, detectIframe = true } = options

  if (!process.client) return () => {}

  let shouldListen = true

  const shouldIgnore = (event: Event): boolean => {
    return ignore.some((target) => {
      if (typeof target === 'string') {
        return Array.from(document.querySelectorAll(target))
          .some(el => el === event.target || (el as Element).contains(event.target as Node))
      }
      const el = unref(target) as Element | null
      return el && (event.target === el || el.contains(event.target as Node))
    })
  }

  const listener = (event: Event) => {
    if (!shouldListen || shouldIgnore(event)) return

    const targetElements = Array.isArray(targets) ? targets : [targets]
    
    const isClickOutside = targetElements.every(target => {
      const el = unref(target) as Element | null
      return el && event.target && !el.contains(event.target as Node)
    })

    if (isClickOutside) {
      handler(event)
    }
  }

  const addListener = (target: EventTarget, event: string, listener: EventListener, options?: AddEventListenerOptions) => {
    target.addEventListener(event, listener, options)
    return () => target.removeEventListener(event, listener, options)
  }

  const cleanup = [
    addListener(document, 'click', listener, { passive: true, capture }),
    addListener(document, 'pointerdown', listener, { passive: true }),
    detectIframe && addListener(window, 'blur', (event) => {
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') {
          handler(event)
        }
      }, 0)
    })
  ].filter(Boolean) as (() => void)[]

  const stop = () => {
    shouldListen = false
    cleanup.forEach(fn => fn())
  }

  return stop
}

// Export par défaut
export default useClickOutside