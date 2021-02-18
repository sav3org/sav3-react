const getHostname = (url) => {
  let hostname
  // remove protocol
  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  }
  else {
    hostname = url.split('/')[0]
  }
  // remove port number
  hostname = hostname.split(':')[0]
  // remove ?
  hostname = hostname.split('?')[0]
  // remove #
  hostname = hostname.split('#')[0]
  return hostname
}

const getRootDomain = (url) => {
  let domain = getHostname(url)
  const splitArr = domain.split('.')
  const arrLen = splitArr.length
  // has subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
    // is using ccTLD (e.g. .me.uk)
    if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
      domain = splitArr[arrLen - 3] + '.' + domain
    }
  }
  return domain
}

export const isYoutube = (link) => {
  const rootDomain = getRootDomain(link)
  if (rootDomain === 'youtube.com') {
    return !!link.match(/watch\?v=([^&]+)/)
  }
  if (rootDomain === 'youtu.be') {
    return true
  }
  return false
}

export const isVimeo = (link) => {
  if (getRootDomain(link) !== 'vimeo.com') {
    return false
  }
  if (!link.match(/\/([^/]+)$/)) {
    return false
  }
  if (!link.match(/\/\d+$/)) {
    return false
  }
  return true
}

export const isTwitter = (link) => {
  if (getRootDomain(link) === 'twitter.com') {
    return true
  }
  return false
}

export const isInstagram = (link) => {
  if (getRootDomain(link) === 'instagram.com') {
    return true
  }
  return false
}

export const isReddit = (link) => {
  if (getRootDomain(link) === 'reddit.com') {
    return true
  }
  return false
}

export const isFacebook = (link) => {
  if (getRootDomain(link) === 'facebook.com') {
    return true
  }
  return false
}

export const isVideo = (link) => {
  // remove query string and match extension
  return link.replace(/[#?].*/, '').match(/\.(mp4|webm|ogg)$/)
}

export const isImage = (link) => {
  // remove query string and match extension
  return link.replace(/[#?].*/, '').match(/\.(jpeg|jpg|png|gif)$/)
}

export const isAudio = (link) => {
  // remove query string and match extension
  return link.replace(/[#?].*/, '').match(/\.(wav|mp3|flac)$/)
}

export default {
  isYoutube,
  isVimeo,
  isTwitter,
  isInstagram,
  isReddit,
  isFacebook,
  isVideo,
  isImage,
  isAudio
}
