const key = "3f0cb8a8";

const movieSearchBox = document.getElementById("movie__search--box");
const resultGrid = document.getElementById("result__grid");
const sortFilter = document.getElementById("sort__filter");
const filterContainer = document.getElementById("filter__container");

let currentMovies = [];

async function loadMovies(searchTerm) {
  const url = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${key}`;
  const response = await fetch(`${url}`);
  const data = await response.json();

  if (data.Response == "True") {
    await displayMovieList(data.Search);
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    findMovies();
  }
}

async function findMovies() {
  let searchTerm = movieSearchBox.value;
  if (searchTerm.length > 0) {
    await loadMovies(searchTerm);
  } else {
    resultGrid.innerHTML = "";
    filterContainer.style.display = "none";
  }
}

async function displayMovieList(movies) {
  resultGrid.innerHTML = "";
  currentMovies = [];
  filterContainer.style.display = "block";

  sortFilter.value = "";

  for (let i = 0; i < movies.length; i++) {
    const result = await fetch(
      `https://www.omdbapi.com/?i=${movies[i].imdbID}&apikey=${key}`
    );
    const movieDetails = await result.json();

    const movieData = {
      ...movies[i],
      details: movieDetails,
      rating: movieDetails.imdbRating || 0,
    };
    currentMovies.push(movieData);

    if (movies[i].Poster != "N/A") {
      moviePoster = movies[i].Poster;
    } else {
      moviePoster = "./img/default_poster.jpg";
    }

    resultGrid.innerHTML += `
        <div class="search__result--item" data-id="${movies[i].imdbID}">
            <div class="search__result--thumbnail">
                <img src="${moviePoster}" class="search__result--img">
            </div>
            <div class="search__result--info">
                <h3 class="search__result--title">${movies[i].Title}</h3>
                <p class="search__result--year">${movies[i].Year}</p>
                <p class="search__result--rating">⭐ ${
                  movieDetails.imdbRating || "N/A"
                }/10</p>
            </div>
        </div>
    `;
  }
}

function sortMovies() {
  const sortValue = sortFilter.value;

  if (!sortValue || currentMovies.length === 0) {
    return;
  }

  if (sortValue === "highest") {
    currentMovies.sort((a, b) => b.rating - a.rating);
  } else if (sortValue === "lowest") {
    currentMovies.sort((a, b) => a.rating - b.rating);
  }

  resultGrid.innerHTML = currentMovies
    .map((movie) => {
      const moviePoster =
        movie.Poster != "N/A" ? movie.Poster : "./img/default_poster.jpg";

      return `
        <div class="search__result--item" data-id="${movie.imdbID}">
            <div class="search__result--thumbnail">
                <img src="${moviePoster}" class="search__result--img">
            </div>
            <div class="search__result--info">
                <h3 class="search__result--title">${movie.Title}</h3>
                <p class="search__result--year">${movie.Year}</p>
                <p class="search__result--rating">⭐ ${
                  movie.details.imdbRating || "N/A"
                }/10</p>
            </div>
        </div>
      `;
    })
    .join("");
}
