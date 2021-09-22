document.getElementById('createPlaylist').addEventListener('click', event => {
  event.preventDefault()
  axios.post('../api/playlists', {
    name: document.getElementById('playlistName').value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(({ data: { id }}) => {
    window.location = `/playlists/add/${id}`
  })
  .catch(err => console.log(err))
})