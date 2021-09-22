document.getElementById('searchForSong').addEventListener('click', event => {
  const search = document.getElementById('songName').value
  axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search}&api_key=7f3036e48535565b6ab375bd9c198876&format=json`)
  .then(({ data: { results: { trackmatches: { track: songs }}}}) => {
    console.log(songs)
    songs.forEach(song => {
      axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=7f3036e48535565b6ab375bd9c198876&artist=${song.artist}&track=${song.name}&format=json`)
      .then(({ data: { track }}) => {
      console.log(track)
      const songElem = document.createElement('tr')
      songElem.innerHTML = `
      <td><img src="${track.album.image[1]['#text']}"></td>
      <td>${track.name}</td>
      <td>${track.artist.name}</td>
      <td><a href="${track.url}">Link</a></td>
      <td><input type="text" class="moodInput" placeholder="Mood"></td>
      <button type="button" class="success button addSong">Add Song</button>
      `
      document.getElementById('songsHere').append(songElem)
    })
      .catch(function (error) {
        console.error(error);
      })
    })
  })
})