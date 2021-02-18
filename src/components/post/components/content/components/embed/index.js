import PropTypes from 'prop-types'
import embedUtils from './utils'
import Video from './components/video'
import Image from './components/image'
import Audio from './components/audio'
import Twitter from './components/twitter'

function PostContentEmbed ({link} = {}) {
  if (embedUtils.isTwitter(link)) {
    return <Twitter link={link} />
  }
  if (embedUtils.isVideo(link)) {
    return <Video link={link} />
  }
  if (embedUtils.isAudio(link)) {
    return <Audio link={link} />
  }
  if (embedUtils.isImage(link)) {
    return <Image link={link} />
  }
  // if no link match return empty component
  return ''
}
PostContentEmbed.propTypes = {link: PropTypes.string.isRequired}

export default PostContentEmbed
