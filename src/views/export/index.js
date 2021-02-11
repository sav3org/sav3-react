import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import ImportForm from './components/form'
import useTranslation from 'src/translations/use-translation'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'

function Export () {
  const t = useTranslation()
  const history = useHistory()

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {t.Import()} / {t.Export()}
        </Typography>
      </TopBar>
      <ImportForm />
    </div>
  )
}

export default Export
