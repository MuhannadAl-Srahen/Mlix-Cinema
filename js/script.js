const global = {
  page: window.location.pathname,
};

async function FetchAPI(endpoint) {
  const API_KEY = 'ef96d66eab300a43b9c7c290ca1f5378';
  const API_URL = 'https://api.themoviedb.org/3/';
  showSpinner();

  const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlighted active link
function highLightLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.page) {
      link.classList.add('active');
    }
  });
}
// Show 18 popular movies
async function displayPopularMovies() {
  try {
    const { results } = await FetchAPI('movie/popular');

    results.forEach((movie) => {
      const img = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'images/no-image.jpg';
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

  } catch (error) {
    console.log(error);
  }
}

// Show 18 popular Tv show
async function displayPopularTVShow() {
  try {
    const { results } = await FetchAPI('tv/popular');

    results.forEach((tv) => {
      const img = tv.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}` : 'images/no-image.jpg';
      const title = tv.name;
      const releaseDate = tv.first_air_date;

      const div = document.createElement('div');
      div.classList.add('card');

      // Construct the HTML content
      div.innerHTML = `
      <div class="card-img-wrapper">
      <a href="tv-details.html?id=${tv.id}">
      <img src="${img}" class="card-img-top" alt="${title}" />
      </a>
      </div>
      <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
      <small class="text-muted">Air Date: ${releaseDate}</small>
      </p>
      </div>`;

      document.getElementById('popular-shows').appendChild(div);
    });
    const cards = document.getElementById('popular-shows');

  } catch (error) {
    console.log(error);
  }
}

async function showMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  try {
    const movieDetails = await FetchAPI(`movie/${movieId}`);
    console.log(movieDetails);

    displayBackgroundImage('movie', movieDetails.backdrop_path);

    const div = document.createElement('div');
    div.id = 'details-top';

    div.innerHTML = `
    <div class="details-top">
          <div class="img-container">
            <img 
              src="${movieDetails.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}` : 'images/no-image.jpg'}"
              class="card-img-top"
              alt="${movieDetails.title}"
            />
          </div>
          <div>
          <h2>${movieDetails.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movieDetails.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
            <p>
              ${movieDetails.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movieDetails.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movieDetails.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumbers(movieDetails.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumbers(movieDetails.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movieDetails.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movieDetails.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movieDetails.production_companies.map((company) => company.name).join(', ')}
          </div>
        </div>
    `;

    document.querySelector('.movie-details').appendChild(div);
  } catch (error) {
    console.log(error);
  }
}

async function showTVShowDetails() {
  const tvShowId = window.location.search.split('=')[1];
  try {
    const tvShowDetails = await FetchAPI(`tv/${tvShowId}`);
    console.log(tvShowDetails);

    displayBackgroundImage('tv', tvShowDetails.backdrop_path);

    const div = document.createElement('div');
    div.id = 'details-top';

    div.innerHTML = `
    <div class="details-top">
          <div class="img-container">
            <img 
              src="${tvShowDetails.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tvShowDetails.backdrop_path}` : 'images/no-image.jpg'}"
              class="card-img-top"
              alt="${tvShowDetails.name}"
            />
          </div>
          <div>
          <h2>${tvShowDetails.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${tvShowDetails.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${tvShowDetails.first_air_date}</p>
            <p>
              ${tvShowDetails.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${tvShowDetails.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${tvShowDetails.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${tvShowDetails.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${tvShowDetails.last_episode_to_air?.name || 'N/A'}</li>
            <li><span class="text-secondary">Status:</span> ${tvShowDetails.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${tvShowDetails.production_companies.map((company) => company.name).join(', ')}
          </div>
        </div>
    `;

    document.querySelector('#show-details').appendChild(div);
  } catch (error) {
    console.log(error);
  }
}

// Display Slider Movies
async function displaySlider() {
  try {
    const { results } = await FetchAPI('movie/now_playing');
    results.forEach((movie) => {
      const div = document.createElement('div');
      div.classList.add('swiper-slide');

      div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` : 'images/no-image.jpg'}" alt="${movie.title}" />
          </a>
          <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
          </h4>
        `;

      document.querySelector('.swiper-wrapper').appendChild(div);
    });

    initSwiper();

  } catch (error) {
    console.error('Error fetching slider data:', error);
  }
}



function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function addCommasToNumbers(number) {
  return number.toString().replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'fixed';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.09';

  if (type === 'movie') {
    document.querySelector('.movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}


function init() {
  switch (global.page) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTVShow();
      break;
    case '/movie-details.html':
      showMovieDetails();
      console.log('Movie details');
      break;
    case '/search.html':
      console.log('Search');
      break;
    case '/tv-details.html':
      showTVShowDetails();
      break;
  }
  highLightLink();
}

document.addEventListener('DOMContentLoaded', init);
