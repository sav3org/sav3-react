import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import assert from 'assert'
import urlRegex from 'url-regex'
import PropTypes from 'prop-types'

function Description ({description} = {}) {
  let descriptionComponents = [description]

  const link = getContentLink(description)
  if (link) {
    const [descriptionPart1, descriptionPart2] = description.split(link)
    let href = link
    if (!link.match(/$https?:\/\//)) {
      href = `https://${link}`
    }
    descriptionComponents = []
    if (descriptionPart1) {
      descriptionComponents.push(descriptionPart1)
    }
    descriptionComponents.push(
      <Link variant='body2' href={href} target='_blank' rel='noopener'>
        {link}
      </Link>
    )
    if (descriptionPart2) {
      descriptionComponents.push(descriptionPart2)
    }
  }

  return <Typography variant='body2'>{descriptionComponents}</Typography>
}

Description.propTypes = {
  description: PropTypes.string.isRequired
}

// only use the first link in a description
const getContentLink = (description) => {
  if (!description) {
    return
  }
  assert(typeof description === 'string', `user description '${description}' is not a string`)
  const links = description.match(urlRegex({strict: false}))
  return links && links[0]
}

export default Description
