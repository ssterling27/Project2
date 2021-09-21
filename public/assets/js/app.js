const { axios } = window

axios.get('/api/playlists', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: playlists }) => {
    console.log(playlists)
    playlists.forEach(({ id, name, u: { username }}) => {
      const playlistElem = document.createElement('div')
      playlistElem.classList = 'cell small-4'
      playlistElem.id = `${id}`
      // playlistElem.style = ''
      playlistElem.innerHTML = `
      <div class="card cardStyling">
      <img class="playlistLink" src="https://thefirenote.com/wp-content/uploads/2017/12/lorde-melodrama-300x300.jpg">
      <div class="card-section playlistLink">
        <h5 class="playlistLink">${name}</h5>
        <h6 class="badge bg-primary rounded-pill playlistLink">${username}</h6>
      </div>
      </div>
      `
      document.getElementById('PlaylistHere').append(playlistElem)
    })
  })

.catch (err => {
  console.log(err)
  window.location = '/auth.html'
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('playlistLink')) {
    const pid = event.target.parentNode.parentNode.id || event.target.parentNode.parentNode.parentNode.id
    window.location = `/playlists/${pid}`
  }
})