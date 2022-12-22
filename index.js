import alfy from 'alfy'
import Odesli from 'odesli.js'
import fs from 'fs'
import axios from 'axios'
import process from 'node:process'

const odesli = new Odesli({
	version: 'v1-alpha.1'
})

const platformMetadata = {
  amazonMusic: {
    displayName: 'Amazon Music',
    icon: './img/amazonMusic.png'
  },
  amazonStore: {
    displayName: 'Amazon Store',
    icon: './img/amazonStore.png'
  },
  anghami: {
    displayName: 'Anghami',
    icon: './img/anghami.png'
  },
  boomplay: {
    displayName: 'Boomplay',
    icon: './img/boomplay.png'
  },
  deezer: {
    displayName: 'Deezer',
    icon: './img/deezer.png'
  },
  napster: {
    displayName: 'Napster',
    icon: './img/napster.png'
  },
  pandora: {
    displayName: 'Pandora',
    icon: './img/pandora.png'
  },
  soundcloud: {
    displayName: 'SoundCloud',
    icon: './img/soundcloud.png'
  },
  spotify: {
    displayName: 'Spotify',
    icon: './img/spotify.png'
  },
  tidal: {
    displayName: 'Tidal',
    icon: './img/tidal.png'
  },
  yandex: {
    displayName: 'Yandex',
    icon: './img/yandex.png'
  },
  youtube: {
    displayName: 'YouTube',
    icon: './img/youtube.png'
  },
  youtubeMusic: {
    displayName: 'YouTube Music',
    icon: './img/youtubeMusic.png'
  },
  appleMusic: {
    displayName: 'Apple Music',
    icon: './img/appleMusic.png'
  },
  itunes: {
    displayName: 'iTunes',
    icon: './img/itunes.png'
  }
}

function GetEnvironmentVar(varname)
{
    var result = process.env[varname];
    if( result != undefined )
        return result;
    else
        return '1';
}

var config = new Map([
  ['spotify', GetEnvironmentVar('spotify')],
  ['itunes', GetEnvironmentVar('itunes')],
  ['appleMusic', GetEnvironmentVar('appleMusic')],
  ['youtube', GetEnvironmentVar('youtube')],
  ['youtubeMusic', GetEnvironmentVar('youtubeMusic')],
  ['google', GetEnvironmentVar('google')],
  ['googleStore', GetEnvironmentVar('googleStore')],
  ['pandora', GetEnvironmentVar('pandora')],
  ['deezer', GetEnvironmentVar('deezer')],
  ['tidal', GetEnvironmentVar('tidal')],
  ['amazonStore', GetEnvironmentVar('amazonStore')],
  ['amazonMusic', GetEnvironmentVar('amazonMusic')],
  ['soundcloud', GetEnvironmentVar('soundcloud')],
  ['napster', GetEnvironmentVar('napster')],
  ['yandex', GetEnvironmentVar('yandex')],
  ['spinrilla', GetEnvironmentVar('spinrilla')],
  ['audius', GetEnvironmentVar('audius')],
  ['audiomack', GetEnvironmentVar('audiomack')],
  ['anghami', GetEnvironmentVar('anghami')],
  ['boomplay', GetEnvironmentVar('boomplay')]
])

const cacheThumbnail = (url) => {
  if (!fs.existsSync('./cache')) {
    fs.mkdirSync('./cache')
  }

  const fileName = `./cache/${url.split('/').at(-2)}`
  if (fs.existsSync(fileName)) {
    return new Promise((resolve) => resolve(fileName))
  }

  return axios.get(url, { responseType: 'stream' }).then(response => 
    new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(fileName))
        .on('finish', () => resolve(fileName))
        .on('error', e => reject(e))
    }))
}

odesli.fetch(alfy.input).then(song => {
  var platforms = Object.keys(song.linksByPlatform)
  config.forEach(function(value, key) {
        if (value == '0') {
          const index = platforms.indexOf(key)
          if (index > -1) {
            platforms.splice(index, 1)
          }
        }
  })
  const links = platforms.map((platform) => ({
    title: platformMetadata[platform].displayName,
    arg: song.linksByPlatform[platform].url,
    icon: {
      path: platformMetadata[platform].icon,
    }
  }))
  cacheThumbnail(song.thumbnail).then(thumbnailPath => {
    alfy.output([
      {
        title: `${song.title} by ${song.artist[0]}`,
        subtitle: 'Search Powered by Odesli',
        arg: song.pageUrl,
        icon: {
          path: thumbnailPath
        }
      },
      ...links
    ])
  })
})
