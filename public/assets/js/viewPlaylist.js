const { axios } = window
// http://localhost:3000/playlists/id
let pid = window.location.href.split('/').pop()
console.log(pid)
// pid = ['localhost:3000', 'playlists', 'id']
axios.get(`api/playlists/${pid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(( { data: playlist }) => {
    const playlistElem = document.createElement('h5')
    playlistElem.textContent = `${playlist.name}`
    document.getElementById('playlistHere').append(playlistElem)
  })

axios.get(`/api/playlists/${pid}/songs`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: songs }) => {
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
    })
  })