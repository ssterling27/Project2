const { axios } = window
let user_id = ''
axios.get(`../api/users/playlists`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(({ data: { id: uid, username } }) => {
    user_id = uid
    axios.get(`../api/playlists/user/${uid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(({ data: playlists }) => {
    playlists.forEach(({ id, name, u: { username } }) => {
      axios.get(`../api/playlists/${id}/song`)
      .then(({ data: song }) => {
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
      document.getElementById('playlistsHere').append(playlistElem)
    })
  })})
    axios.get(`../api/allsong/${uid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(({ data: song }) => {
      const allSongsElem = document.createElement('div')
      allSongsElem.classList = 'cell small-4'
      allSongsElem.id = 'allSongs'
      allSongsElem.innerHTML = `
      <div class="card cardStyling">
      <img class="allSongsLink" src="${song.artwork}">
      <div class="card-section allSongsLink">
        <h5 class="allSongsLink">All Songs</h5>
        <h6 class="badge bg-primary rounded-pill allSongsLink">${username}</h6>
      </div>
      </div>
      `
      document.getElementById('playlistsHere').prepend(allSongsElem)
    })
  })

  .catch(err => window.location = '/login')


// axios.get('/api/playlists', {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   }
// })
//   .then(({ data: playlists }) => {
//     console.log(playlists)
//     playlists.forEach(({ id, name }) => {
//       const playlistElem = document.createElement('div')
//       playlistElem.classList = 'cell small-4'
//       playlistElem.id = `${id}`
//       // playlistElem.style = ''
//       playlistElem.innerHTML = `
//       <div class="card cardStyling">
//       <img class="playlistLink" src="">
//       <div class="card-section playlistLink">
//         <h5 class="playlistLink">${name}</h5>
//         <h6 class="badge bg-primary rounded-pill playlistLink">${username}</h6>
//       </div>
//       </div>
//       `
//       document.getElementById('PlaylistHere').append(playlistElem)
//     })
//   })

//   .catch(err => console.log(err))

document.addEventListener('click', event => {
  if (event.target.classList.contains('playlistLink')) {
    const pid = event.target.parentNode.parentNode.id || event.target.parentNode.parentNode.parentNode.id
    window.location = `/playlists/${pid}`
  }
  else if (event.target.classList.contains('allSongsLink')) {
    window.location = `/allSongs/${user_id}`
  }
})

document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login'
})