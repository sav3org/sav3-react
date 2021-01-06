import memoize from 'p-memoize'

const createLocalStorageCache = (func) => {
  const localStorageKey = func.toString()
  const cache = {
    has: (key) => {
      return !!localStorage.getItem(`${localStorageKey}-${key}`)
    },
    get: (key) => {
      return JSON.parse(localStorage.getItem(`${localStorageKey}-${key}`))
    },
    set: (key, value) => {
      ;(async () => {
        value.data = await value.data
        localStorage.setItem(`${localStorageKey}-${key}`, JSON.stringify(value))
      })()
    },
    delete: (key) => {
      localStorage.removeItem(`${localStorageKey}-${key}`)
    },
    clear: () => {
      throw Error('localStorageMemoize.clear() not implemented')
    }
  }
  return cache
}

const localStorageMemoize = (func, options = {}) => {
  const cache = createLocalStorageCache(func)
  return memoize(func, {...options, cache})
}

export default localStorageMemoize
