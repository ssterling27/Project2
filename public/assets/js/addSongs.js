let pid = window.location.href.split('/').pop()
let public = false
let thisUser = false
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

axios.get(`/api/playlists/${pid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: playlist }) => {
    playlistUser = playlist.uid
    public = playlist.public
    const playlistNameElem = document.createElement('div')
    playlistNameElem.classList = 'enterSign has-text-centered'
    playlistNameElem.innerHTML = `
    <h1 class="loginTitle">${playlist.name}</h1><br>
    `
    playlistButtonElem = document.createElement('div')
    playlistButtonElem.classList = 'enterSign has-text-centered'
    playlistButtonElem.innerHTML = `
    <button style="margin-bottom: 0px;" type="button" class="button goToPlaylist">Go to Playlist</button>
    `
    document.getElementById('playlistName').prepend(playlistButtonElem)
    document.getElementById('playlistName').prepend(playlistNameElem)
    axios.get('/api/users/playlists', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data: { id } }) => {
        if (id === playlistUser) {
          thisUser = true
        }
        if (thisUser === false && public === false) {
          window.location = '/'
        }
      })
  })
  .catch(err => console.log(err))
  // .catch(err => window.location = '/login')

document.getElementById('searchForSong').addEventListener('click', event => {
  const search = document.getElementById('songName').value
  axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search}&api_key=7f3036e48535565b6ab375bd9c198876&format=json`)
    .then(({ data: { results: { trackmatches: { track: songs } } } }) => {
      const createResults = () => {
        const resultsElem = document.createElement('div')
        resultsElem.classList = 'card-section grid-container fluid'
        resultsElem.id = 'songsHere'
      document.getElementById('resultsHere').append(resultsElem)
      }
      if (document.getElementById('songsHere') == null) {
        createResults()
      } else {
        removeAllChildNodes(document.getElementById('songsHere'))
      }
      document.getElementById('songName').value = ''
      songs.forEach(song => {
        axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=7f3036e48535565b6ab375bd9c198876&artist=${song.artist}&track=${song.name}&format=json`)
          .then(({ data: { track } }) => {
            const songElem = document.createElement('div')
            songElem.classList = 'grid-x grid-margin-x font'
            songElem.style = 'align-items: center;'
            songElem.innerHTML = `
      <div class="cell small-2 trackImage"><img src="${track.album.image[3]['#text']}"></div>
      <div class="cell small-2 trackName" style="margin-left:-3px;">${track.name}</div>
      <div class="cell small-1 trackArtist" style="margin-right:10px;">${track.artist.name}</div>
      <div class="cell small-2 trackAlbum">${track.album.title}</div>
      <div class="cell small-1 trackLink"><a href="${track.url}">Link</a></div>
      <div class="cell small-2 trackMood"><input type="text" class="moodInput element-text" placeholder="Mood"></div>
      <div class="cell small-2 trackAdd"><button style="margin-bottom: 1rem;" type="button" class="button addSongSearch">Add Song</button></div>
      `
            
            document.getElementById('songsHere').append(songElem)
          })
          .catch(function (error) {
            console.error(error);
          })
      })
    })
})

document.addEventListener('click', event => {

  if (event.target.classList.contains('addSong')) {
    let artwork = document.getElementById('artInput').value
    document.getElementById('artInput').value = ''
    let track = document.getElementById('trackTitleInput').value
    document.getElementById('trackTitleInput').value = ''
    let artist = document.getElementById('artistNameInput').value
    document.getElementById('artistNameInput').value = ''
    let album = document.getElementById('albumNameInput').value
    document.getElementById('albumNameInput').value = ''
    let link = document.getElementById('streamLinkInput').value
    document.getElementById('streamLinkInput').value = ''
    let mood = capitalizeFirstLetter(document.getElementById('moodInput').value)
    document.getElementById('moodInput').value = ''
    let request = {
      title: track,
      artist: artist,
      album: album,
      artwork: artwork,
      mood: mood,
      link: link
    }

    axios.post(`../../api/playlists/${pid}/songs`, request, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => console.log('song added'))
  }
  else if (event.target.classList.contains('addSongSearch')) {
    console.log(event.target.parentNode.parentNode.childNodes)
    artwork = event.target.parentNode.parentNode.childNodes[1].lastElementChild.currentSrc
    track = event.target.parentNode.parentNode.childNodes[3].innerText
    artist = event.target.parentNode.parentNode.childNodes[5].innerText
    album = event.target.parentNode.parentNode.childNodes[7].innerText
    link = event.target.parentNode.parentNode.childNodes[9].firstElementChild.href
    mood = capitalizeFirstLetter(event.target.parentNode.parentNode.childNodes[11].children[0].value)
    let request = {
      title: track,
      artist: artist,
      album: album,
      artwork: artwork,
      mood: mood,
      link: link
    }

    axios.post(`../../api/playlists/${pid}/songs`, request, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => event.target.parentNode.parentNode.remove())
  }
  else if (event.target.classList.contains('goToPlaylist')) {
    window.location = `/playlists/${pid}`
  }
})

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})