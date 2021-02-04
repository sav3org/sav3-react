import packageJson from '../package.json'

const config = {
  gitCommitHash: process.env.REACT_APP_GIT_COMMIT_HASH,
  sav3Version: packageJson.version,
  bootstrapUsersGoogleSheetId: '1O4Wutfc34QeBEKIP5X4XtwpmRLOt5ytoDc1qv4nSHIg',
  starServers: ['/dns4/star.sav3.org/tcp/443/wss/p2p-webrtc-star/'],
  ipnsServer: 'https://ipns.sav3.org',
  urlTimeToLive: 1000 * 60 * 60 * 24
}

if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_IS_DOCKER) {
  config.starServers = ['/dns4/localhost/tcp/13579/wss/p2p-webrtc-star/']
  config.ipnsServer = 'https://localhost:9545'
}

window.config = config

export default config
