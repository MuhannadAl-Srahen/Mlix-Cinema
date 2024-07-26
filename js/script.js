const global = {
  page: window.location.pathname,
  search: {
    page: 1,
    totalPages: 1,
    type: '',
    term: '',
    total_results: 0,
  },
  api: {
    apiKey: 'ef96d66eab300a43b9c7c290ca1f5378',
    apiUrl: 'https://api.themoviedb.org/3/'
  }
};

async function FetchAPI(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();

  const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  hideSpinner();
  return data;
}


async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();

  const res = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
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


async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  if (global.search.term != '' && global.search.term != null) {
    const { results, page, total_pages, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.total_results = total_results;


    if (results.length === 0) {
      showError('No results found', 'error');
      return;
    }

    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showError('Please enter a search term', 'error');
  }
}

function displaySearchResults(results) {

  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <div class="card-img-wrapper">
    <a href="movie-details.html?id=${movie.id}">
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` : 'images/no-image.jpg'}" class="card-img-top" alt="${global.search.type === 'movie' ? movie.title : movie.name}" />
    </a>
    </div>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? movie.title : movie.name}</h5>
      <p class="card-text"><small class="text-muted">Release: ${global.search.type === 'movie' ? movie.release_date : movie.first_air_date}</small></p>
    </div>
    </div>
      `;

    document.querySelector('#search-results-heading').innerHTML = `<h2>${results.length} of ${global.search.total_results} Results for '${global.search.term}'</h2>`;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}


function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML += `
      <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next"> Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</span> </div>
    `;

  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Add event listeners to next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, totalPages } = await searchAPIData();
    if (global.search.page > totalPages) {
      global.search.page = totalPages;
      return;
    }
    displaySearchResults(results);


  });

  // Add event listeners to prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, totalPages } = await searchAPIData();
    if (global.search.page < 1) {
      global.search.page = 1;
      return;
    }
    displaySearchResults(results);
  });

}



// Show error
function showError(message, className = 'error') {
  const div = document.createElement('div');
  div.classList.add('alert', className);
  div.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(div);
  setTimeout(() => document.querySelector('.alert').remove(), 3000);
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
      break;
    case '/search.html':
      search();
      break;
    case '/tv-details.html':
      showTVShowDetails();
      break;
  }
  highLightLink();
}

document.addEventListener('DOMContentLoaded', init);
