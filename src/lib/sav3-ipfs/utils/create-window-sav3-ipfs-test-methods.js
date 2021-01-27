const thumbnailUrls = [
  'https://i.imgur.com/iKxWt1c.jpg',
  'https://i.imgur.com/iD4bp6Mb.jpg',
  'https://i.imgur.com/65kSbHTb.jpg',
  'https://i.imgur.com/tNsOG3Bb.jpg',
  'https://i.imgur.com/qiQHwHbb.jpg',
  'https://i.imgur.com/txRRZpd.jpeg'
]

const bannerUrls = ['https://i.imgur.com/ImQWjja.jpeg', 'https://i.imgur.com/txRRZpd.jpeg', 'https://i.imgur.com/2LwSsSu.gif', 'https://i.imgur.com/gpKZaRK.jpeg']

const mediaUrls = ['https://i.imgur.com/qiQHwHb.mp4', 'i.imgur.com/ImQWjja.jpeg', 'http://i.imgur.com/txRRZpd.jpeg', 'https://i.imgur.com/2LwSsSu.gif', 'i.imgur.com/gpKZaRK.jpeg']

const displayNames = ['Jimmy Nguyen', 'Shadders', 'WallStreet5', 'Joshua Henslee', 'John M']

const descriptions = [
  'Founder and CEO of XYZ.  Architect of the XYZ Protocol',
  'I like Networks & Social Paradigm Shifts.',
  'Spanish IT Raspberry Pi 4 + Python #BigData #Hacking #Cybersecurity #IoT #IPv6',
  'U mad bro?',
  'Praesentpellentesquetellussitametnuncfaucibus,sitametconvallissemporta.Sedmetudui,luctusavolutpatid,malesuadaadui.'
]

const descriptionUrls = ['https://mystartup.com', 'mystartup.com', 'https://twitter.com/crypto', 'https://t.me/sav3org']

const contents = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Duis turpis nibh, feugiat gravida venenatis vitae, eleifend eu enim. Ut in luctus lorem. Vivamus lectus nunc, cursus eget eleifend ut, luctus et nibh.',
  'Suspendisse',
  'Praesent pellentesque tellus sit amet nunc faucibus, sit amet convallis sem porta. Sed metus dui, luctus a volutpat id, malesuada a dui.',
  'https://verylonglink.com/veryveryveryveryveryveryveryveryveryvery-long-link Praesent pellentesque tellus sit amet nunc faucibus, sit amet convallis sem porta. Sed metus dui, luctus a volutpat id, malesuada a dui',
  'Nullam egestas eget augue id dapibus',
  'Praesentpellentesquetellussitametnuncfaucibus,sitametconvallissemporta.Sedmetudui,luctusavolutpatid,malesuadaadui.'
]

let randomIndex = 0
const getRandomItemFromArray = (array) => {
  let index = Math.floor(Math.random() * array.length)
  index += randomIndex++
  index = index % array.length
  return array[index]
}

const createWindowSav3IpfsTestMethods = (sav3Ipfs) => {
  window.sav3IpfsTest = {}

  window.sav3IpfsTest.add = async () => {
    const data = {
      content: 'hello world ' + Math.random()
    }
    const res = await sav3Ipfs.ipfs.add(data)
    console.log(res)
    // for await (const res of ipfs.add(data)) {
    //   console.log(res)
    // }
  }

  window.sav3IpfsTest.get = async (cid) => {
    for await (const file of sav3Ipfs.ipfs.get(cid)) {
      console.log(file.path)

      if (!file.content) continue

      const content = []

      for await (const chunk of file.content) {
        content.push(chunk)
      }

      console.log(content.toString())
    }
  }

  window.sav3IpfsTest.addresses = async () => {
    const res = await sav3Ipfs.ipfs.swarm.addrs()
    for (const i in res) {
      for (const addr of res[i].addrs) {
        addr.string = addr.toString()
      }
    }
    console.log(res)
  }

  window.sav3IpfsTest.peers = async () => {
    const res = await sav3Ipfs.ipfs.swarm.peers()
    for (const peer of res) {
      peer.addrString = peer.addr.toString()
    }
    console.log(res)
  }

  window.sav3IpfsTest.editProfile = async () => {
    const descriptionUrl = Math.random() > 0.5 ? getRandomItemFromArray(descriptionUrls) : ''
    await sav3Ipfs.editUserProfile({
      displayName: getRandomItemFromArray(displayNames),
      description: `${getRandomItemFromArray(descriptions).substring(0, 100)} ${descriptionUrl}`,
      thumbnailUrl: getRandomItemFromArray(thumbnailUrls),
      bannerUrl: getRandomItemFromArray(bannerUrls)
    })
  }

  window.sav3IpfsTest.publishPosts = async (amount = 5) => {
    let previousPostCid
    while (amount--) {
      const mediaUrl = Math.random() > 0.5 ? getRandomItemFromArray(mediaUrls) : ''
      let quotedPostCid
      if (amount === 3) {
        quotedPostCid = previousPostCid
      }
      previousPostCid = await sav3Ipfs.publishPost({quotedPostCid, content: `${getRandomItemFromArray(contents).substring(0, 100)} ${mediaUrl}`})
    }
  }

  window.sav3IpfsTest.editProfileAndPublishPosts = async (amount) => {
    await window.sav3IpfsTest.editProfile()
    await window.sav3IpfsTest.publishPosts(amount)
  }

  window.sav3IpfsTest.importExport = async (_newPrivateKey) => {
    await sav3Ipfs.waitForReady()
    const oldId = await sav3Ipfs.ipfs.id()
    const oldCid = oldId.id
    const oldPublicKey = oldId.publicKey
    const oldPeerCid = await sav3Ipfs.getOwnPeerCid()
    const oldPrivateKey = await sav3Ipfs.getPrivateKey()

    await sav3Ipfs.setPrivateKey(_newPrivateKey || oldPrivateKey)
    await sav3Ipfs.waitForReady()
    const newId = await sav3Ipfs.ipfs.id()
    const newCid = newId.id
    const newPublicKey = newId.publicKey
    const newPeerCid = await sav3Ipfs.getOwnPeerCid()
    const newPrivateKey = await sav3Ipfs.getPrivateKey()

    console.log('oldCid', oldCid)
    console.log('newCid', newCid)
    console.log('oldPeerCid', oldPeerCid)
    console.log('newPeerCid', newPeerCid)
    console.log('oldPublicKey', oldPublicKey)
    console.log('newPublicKey', newPublicKey)
    console.log('oldPrivateKey', oldPrivateKey)
    console.log('newPrivateKey', newPrivateKey)
  }

  window.sav3IpfsTest.getPreviousPostCids = (...lastPostCids) => {
    for (const lastPostCid of lastPostCids) {
      ;(async () => {
        let index = 1
        for await (const postCid of sav3Ipfs.getPreviousPostCids(lastPostCid)) {
          console.log('getPreviousPostCids', lastPostCid, index++, postCid)
        }
      })()
    }
  }
}

export default createWindowSav3IpfsTestMethods
