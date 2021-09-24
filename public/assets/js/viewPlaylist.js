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
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
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
        console.log(thisUser)
        const playlistElem = document.createElement('tr')
        playlistElem.innerHTML = `
    <td><h5>${playlist.name}</h5></td>
    <td><div style="font-size:1rem;" class="badge bg-primary rounded-pill">${playlist.u.username}</div></td>
    <td><div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Sort by Mood</button>
    <ul class="dropdown-menu" id="moodsHere" aria-labelledby="drowndownMenuButton1">
    <li><a class="dropdown-item moodSelector" href="">All</a></li>
    </ul>
    </div></td>
    ${public || thisUser ? '<td><button type="button" class="success button addSongs">Add Songs</button></td>' : ''}
    ${thisUser && public ? '<td><button type="button" class="button publicButton">Hide</button></td>' : '' }
    ${thisUser && !public ? '<td><button type="button" class="button publicButton">Go Public</button></td>' : '' }
    ${!thisUser && public ? '<td><h5 style="color:blue;">Public</h5></td>' : '' }
    ${!thisUser && !public ? '<td><h5 style="color:red;">Not Public</h5></td>' : '' }
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
              const songElem = document.createElement('tr')
              songElem.innerHTML = `
      <td><img src="${song.artwork}" style="width: 100px;"></td>
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.album}</td>
      <td><a href="${song.link}">Link</a></td>
      <td>${song.mood}</td>
      ${public || thisUser ? `<td><button type="button" id="${song.id}" class="alert button deleteSong">Delete</button></td>` : ''}
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
          const songElem = document.createElement('tr')
          songElem.innerHTML = `
      <td><img src="${song.artwork} style="width: 100px;"></td>
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.album}</td>
      <td><a href="${song.link}">Link</a></td>
      <td>${song.mood}</td>
      ${public || thisUser ? `<td><button type="button" id="${song.id}" class="alert button deleteSong">Delete</button></td>` : ''}
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
      } else {
        event.target.textContent = 'Go Public'
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
})

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})