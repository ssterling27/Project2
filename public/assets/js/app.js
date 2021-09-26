const { axios } = window
let i = 0

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
      if (i < 5) {
        const carouselElem = document.createElement('div')
      carouselElem.classList = "card carouselThing"
      carouselElem.src = `${song.artwork}`
      carouselElem.innerHTML = `
      <img src="${song.artwork}">
      <div class="card-section cut">
        <h5 class="header">${name}</h5>
        <div class="userButton">
        <h6 class="badge bg-primary rounded-pill">${username}</h6>
        <a href="/playlists/${id}" class="button">View Playlist</a>
        </div>
      </div>
      `
        document.getElementById(`carouselItem${i}Here`).append(carouselElem)
        
      }
      const playlistElem = document.createElement('div')
      playlistElem.classList = 'cell small-3'
      playlistElem.style = 'margin-bottom: 10px;'
      playlistElem.id = `${id}`
      // playlistElem.style = ''
      playlistElem.innerHTML = `
      <div class="card space cardStyling">
      <img class="playlistLink" src="${song.artwork}">
      <div class="card-section cut playlistLink bottom">
        <h5 class="playlistLink header" style="font-size: 1.5rem;">${name}</h5>
        <h6 class="badge bg-primary rounded-pill playlistLink">${username}</h6>
      </div>
      </div>
      `
      document.getElementById('PlaylistHere').append(playlistElem)
      i++
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

document.addEventListener('DOMContentLoaded', function () {
  var options = {
    padding: 200,
  }
  var elems = document.querySelectorAll('.carousel');
  var instances = M.Carousel.init(elems, options);
  window.next = function () {
    var el = document.querySelector(".carousel");
    var l = M.Carousel.getInstance(el);
    l.next(1);
  }
  setInterval(() => next(), 2000)
});

// new Sign().print(document.body)
