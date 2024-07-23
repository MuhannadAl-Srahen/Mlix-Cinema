const global = {
  page: window.location.pathname,
};

// Highlighted active link
function highLightLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.page) {
      link.classList.add('active');
    }
  });
}

async function FetchAPI(endpoint) {
  const API_KEY = 'ef96d66eab300a43b9c7c290ca1f5378';
  const API_URL = 'https://api.themoviedb.org/3/';

  const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();

  return data;
}

async function displayPopularMovies() {
  try {
    const { results } = await FetchAPI('movie/popular');

    results.forEach((movie) => {
      const img = movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : 'images/no-image.jpg';
      const title = movie.title;
      const releaseDate = movie.release_date;

      const div = document.createElement('div');
      div.classList.add('card');

      // Construct the HTML content
      div.innerHTML = `
      <div class="card-img-wrapper">
      <a href="movie-details.html?id=${movie.id}">
      <img src="${img}" class="card-img-top" alt="${title}" />
      </a>
      </div>
      <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
      <small class="text-muted">Release: ${releaseDate}</small>
      </p>
      </div>`;

      document.getElementById('popular-movies').appendChild(div);
    });

    const cards = document.getElementById('popular-movies');
    cards.removeChild(cards.lastElementChild);
    cards.removeChild(cards.lastElementChild);

  } catch (error) {
    console.log(error);
  }
}


function init() {
  switch (global.page) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/movie-details.html':
      console.log('Movie details');
      break;
    case '/search.html':
      console.log('Search');
      break;
    case '/shows.html':
      console.log('TV shows');
      break;
    case '/tv-details.html':
      console.log('TV details');
      break;
  }

  highLightLink();
}

document.addEventListener('DOMContentLoaded', init);
