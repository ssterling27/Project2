const { axios } = window
// http://localhost:3000/playlists/id
let pid = window.location.href.split('/').pop()
console.log(pid)
// pid = ['localhost:3000', 'playlists', 'id']
let moods = []
let uniqueMoods = []
let public = false
let user_id = ''
// function to remove all songs to repopulate for mood
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
axios.get(`api/playlists/${pid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(( { data: playlist }) => {
    const playlistElem = document.createElement('tr')
    playlistElem.innerHTML = `
    <td><h5>${playlist.name}</h5></td>
    <td><div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Sort by Mood</button>
    <ul class="dropdown-menu" id="moodsHere" aria-labelledby="drowndownMenuButton1">
    <li><a class="dropdown-item moodSelector" href="">All</a></li>
    </ul>
    </div></td>
    `
    document.getElementById('playlistHere').append(playlistElem)
    public = playlist.public
    user_id = playlist.uid
  })

axios.get(`/api/playlists/${pid}/songs`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: songs }) => {
    console.log(songs)
    songs.forEach(song => {
      console.log(song)
      const songElem = document.createElement('tr')
      songElem.innerHTML = `
      <td>artwork</td>
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.album}</td>
      <td><a href="${song.link}">Link</a></td>
      <td>${song.mood}</td>
      `
      document.getElementById('songsHere').append(songElem)
      moods.push(song.mood)
      
    })
    
    moods.forEach(mood => {
      if (!uniqueMoods.includes(mood)) {
        uniqueMoods.push(mood)
      }
    })
    console.log(uniqueMoods)
    uniqueMoods.forEach(mood => {
      console.log(mood)
      moodElem = document.createElement('li')
      moodElem.innerHTML = `<a class="dropdown-item moodSelector" href="">${mood}</a>`
      document.getElementById('moodsHere').append(moodElem)
    })
  })

document.addEventListener('click', event => {
  if (event.target.classList.contains('moodSelector')) {
    event.preventDefault()
    removeAllChildNodes(document.getElementById('songsHere'))
    axios.get(`/api/playlists/${pid}/songs/mood/${event.target.textContent}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data: songs }) => {
        songs.forEach(song => {
          const songElem = document.createElement('tr')
          songElem.innerHTML = `
      <td>artwork</td>
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.album}</td>
      <td><a href="${song.link}">Link</a></td>
      <td>${song.mood}</td>
      `
          document.getElementById('songsHere').append(songElem)
  })
})
  }
})