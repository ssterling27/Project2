const { axios } = window

axios.get('/api/playlists/public', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: playlists }) => {
    console.log(playlists)
    playlists.forEach(({ id, name, u: { username }}) => {
      axios.get(`../api/playlists/${id}/song`)
      .then(({data: song }) => {
      const playlistElem = document.createElement('div')
      playlistElem.classList = 'cell small-4'
      playlistElem.id = `${id}`
      // playlistElem.style = ''
      playlistElem.innerHTML = `
      <div class="card cardStyling">
      <img class="playlistLink" src="${song.artwork}">
      <div class="card-section playlistLink">
        <h5 class="playlistLink">${name}</h5>
        <h6 class="badge bg-primary rounded-pill playlistLink">${username}</h6>
      </div>
      </div>
      `
      document.getElementById('PlaylistHere').append(playlistElem)
      })
    })
  })

.catch (err => {
  console.log(err)
  window.location = '/login'
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('playlistLink')) {
    const pid = event.target.parentNode.parentNode.id || event.target.parentNode.parentNode.parentNode.id
    window.location = `/playlists/${pid}`
  }
})

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})