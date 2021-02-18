import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import assert from 'assert'
import urlRegex from 'url-regex'
import PropTypes from 'prop-types'
import PostContentEmbed from './components/embed'
import {forceHttps} from '../../utils'

const useStyles = makeStyles((theme) => ({
  contentLink: {
    wordBreak: 'break-all'
  }
}))

function PostContent ({content} = {}) {
  const classes = useStyles()
  let contentComponents = [content]

  const link = getPostContentLink(content)
  if (link) {
    let href = link
    // don't force https for links, only for embeds
    if (!link.match(/^https?:\/\//)) {
      href = `https://${link}`
    }
    const [contentPart1, contentPart2] = content.split(link)
    contentComponents = []
    if (contentPart1) {
      contentComponents.push(contentPart1)
    }
    contentComponents.push(
      <Link className={classes.contentLink} key='content link' variant='body2' href={href} target='_blank' rel='noopener'>
        {link}
      </Link>
    )
    if (contentPart2) {
      contentComponents.push(contentPart2)
    }
  }

  return (
    <Box>
      <Typography variant='body2'>{contentComponents}</Typography>
      {link && <PostContentEmbed link={forceHttps(link)} />}
    </Box>
  )
}
PostContent.propTypes = {content: PropTypes.string.isRequired}

// only use the first link in a post
const getPostContentLink = (content) => {
  if (!content) {
    return
  }
  assert(typeof content === 'string', `post content '${content}' is not a string`)
  const links = content.match(urlRegex({strict: false}))
  return links && links[0]
}

export default PostContent
