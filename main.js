const API_KEY = "6dab92db";

function resultsOnTheScreen(data) {
  const resultsContainer = document.getElementById('results');

  if (data.Response === "True") {
    resultsContainer.innerHTML = ''; 
    console.log(data);

    data.Search.forEach(movie => {
      const movieElement = document.createElement('div');

      movieElement.classList.add(
        'movie',
        'border',
        'rounded-lg',
        'shadow-lg',
        'p-6',
        'flex',
        'flex-col',
        'gap-4',
        'items-center',
        'bg-white',
        'hover:shadow-2xl',
        'transition-shadow',
        'w-full',
        'h-full',
        'cursor-pointer'
      );

      movieElement.innerHTML = `
        <img 
          src="${movie.Poster}" 
          alt="${movie.Title}" 
          class="w-full h-[500px] object-cover rounded-md shadow-md" 
        />
        <h3 class="text-lg font-semibold text-center text-gray-800">${movie.Title} (${movie.Year})</h3>
        <p class="text-sm text-gray-600 text-center font-semibold">Type: ${movie.Type}</p>
      `;

      movieElement.addEventListener('click', () => {
        const imdbUrl = `https://www.imdb.com/title/${movie.imdbID}/`;
        window.open(imdbUrl, '_blank');
      });

      resultsContainer.appendChild(movieElement);
    });
  } else {
    resultsContainer.innerHTML = `<p>No results found.</p>`;
  };
};

async function fetchMovies(title, year) {
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}${year ? `&y=${year}` : ''}`; // надо поменять протокол на https, хотя в доке http, чтобы не вылазила ошибка Mixed Content
    const response = await fetch(url);
    const data = await response.json();

    resultsOnTheScreen(data);
  } catch (error) {
    console.error("Error:", error);
  };
};
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('movie-title');
  const yearInput = document.getElementById('movie-year');
  const resetButton = document.querySelector('button[type="reset"]');


  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const liveSearch = debounce(() => {
    const title = searchInput.value.trim();
    const year = yearInput.value.trim();

    if (title) {
      fetchMovies(title, year);
    } else {
      clearResults(); 
    }
  }, 500);

  searchInput.addEventListener('input', liveSearch);
  yearInput.addEventListener('input', liveSearch);

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    yearInput.value = '';
    clearResults();
  });

  function clearResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; 
  };
});