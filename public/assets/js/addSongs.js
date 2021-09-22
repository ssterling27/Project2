document.getElementById('searchForSong').addEventListener('click', event => {
  const search = document.getElementById('songName').value
  axios.get(http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search}&api_key=7f3036e48535565b6ab375bd9c198876&format=json)
  .then(function (response) {
    console.log();
    let songs = response.data.results.trackmatches.track
    songs.forEach(song => {
      console.log(song)
      const songElem = document.createElement('tr')
      songElem.innerHTML = `
      <td><img src="${song.image[1]['#text']}"></td>
      <td>${song.name}</td>
      <td>${song.artist}</td>
      <td><a href="${song.url}">Link</a></td>
      <button class="addSong">Add Song</button>
      `
      document.getElementById('songsHere').append(songElem)
    })
      .catch(function (error) {
        console.error(error);
      });