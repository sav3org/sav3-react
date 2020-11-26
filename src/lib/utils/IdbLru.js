// forked from https://www.npmjs.com/package/hashlru and replaced cache with localforage (indexeddb key value store)
// TODO: needs to fork the unit tests, no clue if it works properly or has performance issues

import * as localForage from "localforage"
import assert from 'assert'
import delay from 'delay'

const IdbLru = ({name, maxSize} = {}) => {
  assert(typeof name === 'string', `invalid idb lru cache '${name}' not a string`)
  assert(typeof maxSize === 'number', `invalid idb lru maxSize '${maxSize}' not a number`)

  let cache, _cache, size
  // init asynchronously because it makes a nice api
  // and should not cause any problem
  let ready = false
  const init = async () => {
    const cache1 = localForage.createInstance({name})
    const cache2 = localForage.createInstance({name: `_${name}`})
    const cache1Size = await cache1.length()
    const cache2Size = await cache2.length()
    // the bigger cache should become _cache
    if (cache1Size > cache2Size) {
      _cache = cache1
      cache = cache2
      size = cache1Size
    }
    else {
      _cache = cache2
      cache = cache1
      size = cache2Size
    }
    ready = true
  }
  init()

  const waitForReady = async () => {
    if (ready) {
      return
    }
    await delay(10)
    await waitForReady()
  }

  async function update (key, setValue) {
    await cache.setItem(key, setValue)
    size ++
    if(size >= maxSize) {
      size = 0
      const tempCache = cache
      const temp_Cache = _cache
      _cache = tempCache
      cache = temp_Cache
      await cache.clear()
    }
  }

  return {
    has: async function (key) {
      await waitForReady()
      const value = await cache.getItem(key)
      const _value = await _cache.getItem(key)
      return (value !== null && value !== undefined) || (_value !== null && _value !== undefined)
    },
    remove: async function (key) {
      await waitForReady()
      await cache.removeItem(key)
      await _cache.removeItem(key)
    },
    get: async function (key) {
      await waitForReady()
      const value = await cache.getItem(key)
      const _value = await _cache.getItem(key)

      var v = value
      if(v !== null && value !== undefined) return v
      if((v = _value) !== null && (v = _value) !== undefined) {
        await update(key, v)
        return v
      }
    },
    set: async function (key, setValue) {
      await waitForReady()
      const value = await cache.getItem(key)
      if(value !== null && value !== undefined) {
        await cache.setItem(key, setValue)
      }
      else {
        await update(key, setValue)
      }
    },
    clear: async function () {
      await waitForReady()
      await cache.clear()
      await _cache.clear()
    }
  }
}

export default IdbLru
