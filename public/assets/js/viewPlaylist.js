const { axios } = window
// http://localhost:3000/playlists/id
let pid = window.location.href.split('/').pop()
console.log(pid)
// pid = ['localhost:3000', 'playlists', 'id']
let moods = []
let uniqueMoods = []
let public = false
let thisUser = false
let playlistUser = ''
let playlist = ''
// function to remove all songs to repopulate for mood
function removeAllChildNodes(parent) {
  while (parent.childNodes.length > 2) {
    parent.childNodes[2].remove()
  }
}
axios.get(`/api/playlists/${pid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: playlist }) => {
    const playlistNameElem = document.createElement('div')
    playlistNameElem.classList = 'enterSign has-text-centered'
    playlistNameElem.innerHTML = `
    <h1 class="loginTitle">${playlist.name}</h1><br>
    `
    document.getElementById('playlistName').prepend(playlistNameElem)
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
        console.log(thisUser)
        const playlistElem = document.createElement('tr')
        playlistElem.innerHTML = `
    <td><div style="font-size:1rem;" class="badge bg-primary rounded-pill">${playlist.u.username}</div></td>
    <td><div class="dropdown">
    <button class="button dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Sort by Mood</button>
    <ul class="dropdown-menu" id="moodsHere" aria-labelledby="drowndownMenuButton1">
    <li><a class="dropdown-item moodSelector" href="">All</a></li>
    </ul>
    </div></td>
    ${public || thisUser ? '<td><button type="button" class="button addSongs">Add Songs</button></td>' : ''}
    ${thisUser && public ? '<td><button type="button" class="button publicButton">Hide</button></td>' : ''}
    ${thisUser && !public ? '<td><button type="button" class="button publicButton">Go Public</button></td>' : ''}
    ${!thisUser && public ? '<td><h5 style="color:blue;">Public</h5></td>' : ''}
    ${!thisUser && !public ? '<td><h5 style="color:red;">Not Public</h5></td>' : ''}
    ${thisUser ? '<td><button type="button" class="button playlistDelete">Delete Playlist</button></td>' : ''}
    `
        document.getElementById('playlistHere').append(playlistElem)
        axios.get(`/api/playlists/${pid}/songs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(({ data: songs }) => {
            console.log(songs)
            songs.forEach(song => {
              const songElem = document.createElement('div')
              songElem.classList = 'grid-x grid-margin-x font'
              songElem.style = 'align-items: center;'
              songElem.innerHTML = `
            <div class="cell small-1 trackImage"><img src="${song.artwork}"></div>
            <div class="cell small-2 trackName" style="margin-left:-3px;">${song.title}</div>
            <div class="cell small-2 trackArtist" style="margin-right:10px;">${song.artist}</div>
            <div class="cell small-2 trackAlbum">${song.album}</div>
            <div class="cell small-1 trackLink"><a href="${song.link}">Link</a></div>
            <div class="cell small-2 trackMood">${song.mood}</div>
            ${public || thisUser ? `<div class="cell small-2 trackAdd"><button type="button" id="${song.id}" class="button deleteSong">Delete</button></div>` : ''}
          `
              document.getElementById('songsHere').append(songElem)
              moods.push(song.mood)

            })

            moods.forEach(mood => {
              if (!uniqueMoods.includes(mood)) {
                uniqueMoods.push(mood)
              }
            })
            uniqueMoods.forEach(mood => {
              moodElem = document.createElement('li')
              moodElem.innerHTML = `<a class="dropdown-item moodSelector" href="">${mood}</a>`
              document.getElementById('moodsHere').append(moodElem)
            })
          })
      })
  })

  .catch(err => window.location = '/login')




document.addEventListener('click', event => {
  if (event.target.classList.contains('moodSelector')) {
    event.preventDefault()
    removeAllChildNodes(document.getElementById('songsHere'))
    moodSelect = event.target.textContent
    if (moodSelect !== 'All') {
      getRequest = `/api/playlists/${pid}/songs/mood/${moodSelect}`
    } else {
      getRequest = `../api/playlists/${pid}/songs`
    }
    axios.get(getRequest, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data: songs }) => {
        songs.forEach(song => {
          const songElem = document.createElement('div')
          songElem.classList = 'grid-x grid-margin-x font'
          songElem.style = 'align-items: center;'
          songElem.innerHTML = `
            <div class="cell small-1 trackImage"><img src="${song.artwork}"></div>
            <div class="cell small-2 trackName" style="margin-left:-3px;">${song.title}</div>
            <div class="cell small-2 trackArtist" style="margin-right:10px;">${song.artist}</div>
            <div class="cell small-2 trackAlbum">${song.album}</div>
            <div class="cell small-1 trackLink"><a href="${song.link}">Link</a></div>
            <div class="cell small-2 trackMood">${song.mood}</div>
            ${public || thisUser ? `<div class="cell small-2 trackAdd"><button type="button" id ="${song.id}" class="button deleteSong">Delete</button></div>` : ''}
          `
          document.getElementById('songsHere').append(songElem)
        })
      })
  }
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('publicButton')) {
    public = !public
    axios.put(`/api/playlists/${pid}`,
      {
        public: public
      })
      .then(() => {
        if (event.target.textContent === 'Go Public') {
          event.target.textContent = 'Hide'
          
          // event.target.style = 'background-color: rgb(255, 82, 134); color:black;'
          // event.target.style.hover = 'background-color: rgb(0, 206, 233);'
        } else {
          event.target.textContent = 'Go Public'
          // event.target.style = 'background-color: rgb(255, 82, 134); color: black;'
          
        }
      })
      .catch(err => console.error(err))
  }
  else if (event.target.classList.contains('deleteSong')) {
    sid = event.target.id
    axios.delete(`/api/playlists/${pid}/songs/${sid}`)
      .then(() => {
        event.target.parentNode.parentNode.remove()
      })
      .catch(err => console.log(err))
  }
  else if (event.target.classList.contains('addSongs')) {
    window.location = `/playlists/add/${pid}`
  }
  else if (event.target.classList.contains('playlistDelete')) {
    axios.delete(`/api/playlists/${pid}`)
      .then(() => {
        window.location = '/'
      })
      .catch(err => console.log(err))
  }
})

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})