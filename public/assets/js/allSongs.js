const { axios } = window
// http://localhost:3000/allsongs/:uid
let uid = window.location.href.split('/').pop()

// pid = ['localhost:3000', 'playlists', 'id']
let moods = []
let uniqueMoods = []
let thisUser = false
let playlistUser = ''
let playlist = ''
// function to remove all songs to repopulate for mood
function removeAllChildNodes(parent) {
  while (parent.childNodes.length > 2) {
    parent.childNodes[2].remove()
  }
}

  
  axios.get('../api/users/playlists', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(({data: {id, username}}) => {
      if (id == uid) {
        thisUser = true
      }
      const allSongsElem = document.createElement('tr')
        allSongsElem.innerHTML = `
    <td><div style="font-size:1rem;" class="badge bg-primary rounded-pill">${username}</div></td>
    <td><div class="dropdown">
    <button class="button dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Sort by Mood</button>
    <ul class="dropdown-menu" id="moodsHere" aria-labelledby="drowndownMenuButton1">
    <li><a class="dropdown-item moodSelector" href="">All</a></li>
    </ul>
    </div></td>
    `
      document.getElementById('playlistHere').append(allSongsElem)
      axios.get(`../api/allsongs/${uid}`, {
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
            <div class="cell small-3 trackName" style="margin-left:-3px;">${song.title}</div>
            <div class="cell small-2 trackArtist" style="margin-right:10px;">${song.artist}</div>
            <div class="cell small-2 trackAlbum">${song.album}</div>
            <div class="cell small-2 trackLink"><a href="${song.link}">Link</a></div>
            <div class="cell small-2 trackMood">${song.mood}</div>
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
  .catch(err => window.location = '/login')
    
 




  document.addEventListener('click', event => {
    if (event.target.classList.contains('moodSelector')) {
      event.preventDefault()
      removeAllChildNodes(document.getElementById('songsHere'))
      moodSelect = event.target.textContent
      if (moodSelect !== 'All') {
        getRequest = `../api/allsongs/${uid}/mood/${moodSelect}`
      } else {
        getRequest = `../api/allsongs/${uid}`
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
            <div class="cell small-3 trackName" style="margin-left:-3px;">${song.title}</div>
            <div class="cell small-2 trackArtist" style="margin-right:10px;">${song.artist}</div>
            <div class="cell small-2 trackAlbum">${song.album}</div>
            <div class="cell small-2 trackLink"><a href="${song.link}">Link</a></div>
            <div class="cell small-2 trackMood">${song.mood}</div>
          `
        document.getElementById('songsHere').append(songElem)
          })
        })
    }
  })

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})