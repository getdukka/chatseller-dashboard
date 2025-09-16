// composables/useDebounce.ts - DEBOUNCE COMPOSABLE
import { ref, readonly } from 'vue'

/**
 * Creates a debounced version of a function
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let timeoutId: NodeJS.Timeout | null = null

  const debouncedFn = ((...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }) as T

  return debouncedFn
}

/**
 * Creates a debounced ref that updates after a delay
 * @param initialValue - Initial value
 * @param delay - Delay in milliseconds
 * @returns Object with immediate and debounced values
 */
export function useDebouncedRef<T>(initialValue: T, delay: number = 300) {
  const immediate = ref<T>(initialValue)
  const debounced = ref<T>(initialValue)
  let timeoutId: NodeJS.Timeout | null = null

  const updateDebounced = (value: T) => {
    immediate.value = value

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debounced.value = value
      timeoutId = null
    }, delay)
  }

  return {
    immediate,
    debounced,
    update: updateDebounced
  }
}

/**
 * Creates a debounced search function with loading state
 * @param searchFn - The search function to debounce
 * @param delay - Delay in milliseconds
 * @returns Object with search function and loading state
 */
export function useDebouncedSearch<T extends (...args: any[]) => Promise<any>>(
  searchFn: T,
  delay: number = 300
) {
  const isSearching = ref(false)
  let timeoutId: NodeJS.Timeout | null = null
  let currentPromise: Promise<any> | null = null

  const debouncedSearch = ((...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Set loading state immediately for immediate feedback
    isSearching.value = true

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          // Cancel previous search if still running
          currentPromise = null
          
          const promise = searchFn(...args)
          currentPromise = promise
          
          const result = await promise
          
          // Only update if this is still the current search
          if (currentPromise === promise) {
            isSearching.value = false
            resolve(result)
          }
        } catch (error) {
          // Only update if this is still the current search
          if (currentPromise) {
            isSearching.value = false
            reject(error)
          }
        } finally {
          timeoutId = null
        }
      }, delay)
    })
  }) as T

  const cancelSearch = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    currentPromise = null
    isSearching.value = false
  }

  return {
    search: debouncedSearch,
    isSearching: readonly(isSearching),
    cancel: cancelSearch
  }
}

/**
 * Creates a throttled version of a function
 * @param fn - The function to throttle
 * @param limit - The throttle limit in milliseconds
 * @returns A throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
): T {
  let inThrottle = false

  const throttledFn = ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }) as T

  return throttledFn
}

/**
 * Creates a debounced async function with proper cleanup
 * @param asyncFn - The async function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced async function with cleanup
 */
export function useDebouncedAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  delay: number = 300
) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  let timeoutId: NodeJS.Timeout | null = null
  let abortController: AbortController | null = null

  const debouncedAsyncFn = async (...args: Parameters<T>): Promise<any> => {
    // Clear existing timeout and abort previous request
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    
    if (abortController) {
      abortController.abort()
    }

    error.value = null

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          isLoading.value = true
          abortController = new AbortController()
          
          const result = await asyncFn(...args)
          
          if (!abortController.signal.aborted) {
            resolve(result)
          } else {
            resolve(null)
          }
        } catch (err) {
          if (!abortController?.signal.aborted) {
            error.value = err as Error
            reject(err)
          } else {
            resolve(null)
          }
        } finally {
          if (!abortController?.signal.aborted) {
            isLoading.value = false
          }
          timeoutId = null
        }
      }, delay)
    })
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    isLoading.value = false
    error.value = null
  }

  return {
    execute: debouncedAsyncFn as T,
    isLoading: readonly(isLoading),
    error: readonly(error),
    cancel
  }
}
