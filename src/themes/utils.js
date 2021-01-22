import assert from 'assert'

export const setRgbaAlpha = (rgbaString, alpha) => {
  assert(typeof rgbaString === 'string', `themesUtils.setRgbaAlpha invalid rgbaString '${rgbaString}'`)
  assert(typeof alpha === 'string' || typeof alpha === 'number', `themesUtils.setRgbaAlpha invalid alpha '${alpha}'`)
  const [r, g, b] = rgbaString.match(/[\d.]+/g)
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
}

export const scaleRgbaAlpha = (rgbaString, scaleFactor) => {
  assert(typeof rgbaString === 'string', `themesUtils.scaleRgbaAlpha invalid rgbaString '${rgbaString}'`)
  assert(typeof scaleFactor === 'string' || typeof scaleFactor === 'number', `themesUtils.scaleRgbaAlpha invalid alpha '${scaleFactor}'`)
  const [r, g, b, a] = rgbaString.match(/[\d.]+/g)
  return `rgba(${r}, ${g}, ${b}, ${(a * scaleFactor).toFixed(3)})`
}

export default {
  setRgbaAlpha,
  scaleRgbaAlpha
}
