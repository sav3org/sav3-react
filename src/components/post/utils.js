import assert from 'assert'

export const forceHttps = (link) => {
  assert(typeof link === 'string', `forceHttps link '${link}' not a string`)
  link = link.trim()
  // has no http/https
  if (!link.match(/^https?:\/\//)) {
    link = `https://${link}`
  }
  else {
    // force https if http
    link = link.replace(/^http:\/\//, 'https://')
  }
  return link
}

export default {
  forceHttps
}
