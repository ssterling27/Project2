let pid = window.location.href.split('/').pop()
let public = false
let thisUser = false

axios.get(`/api/playlists/${pid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: playlist }) => {
    console.log(playlist)
    playlistUser = playlist.uid
    public = playlist.public
    axios.get('/api/users/playlists', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data: { id } }) => {
        console.log(id)
        if (id === playlistUser) {
          thisUser = true
        }
        if (thisUser === false && public === false) {
          window.location = '/'
        }
      })
  })

document.getElementById('searchForSong').addEventListener('click', event => {
  const search = document.getElementById('songName').value
  axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search}&api_key=7f3036e48535565b6ab375bd9c198876&format=json`)
    .then(({ data: { results: { trackmatches: { track: songs } } } }) => {
      console.log(songs)
      songs.forEach(song => {
        axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=7f3036e48535565b6ab375bd9c198876&artist=${song.artist}&track=${song.name}&format=json`)
          .then(({ data: { track } }) => {
            console.log(track)
            const songElem = document.createElement('tr')
            songElem.innerHTML = `
      <td><img src="${track.album.image[1]['#text']}"></td>
      <td>${track.name}</td>
      <td>${track.artist.name}</td>
      <td>${track.album.title}</td>
      <td><a href="${track.url}">Link</a></td>
      <td><input type="text" class="moodInput" placeholder="Mood"></td>
      <button type="button" class="success button addSongSearch">Add Song</button>
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
    let mood = document.getElementById('moodInput').value.toLowerCase()
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
    console.log(event.target.parentNode.childNodes)
    artwork = event.target.parentNode.childNodes[1].lastElementChild.currentSrc
    track = event.target.parentNode.childNodes[3].innerText
    artist = event.target.parentNode.childNodes[5].innerText
    album = event.target.parentNode.childNodes[7].innerText
    link = event.target.parentNode.childNodes[9].firstElementChild.href
    mood = event.target.parentNode.childNodes[11].children[0].value.toLowerCase()
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
      .then(() => event.target.parentNode.remove())
  }
})