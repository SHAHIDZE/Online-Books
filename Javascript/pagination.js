const elPagination = document.querySelector(".js-pagination");
const moviesPerPage = 8;
let currentPage = 1;
let totalPages = Math.ceil(movies.length / moviesPerPage);

function renderPaginationButtons() {
  elPagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");

    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-link");
    btn.dataset.page = i;

    if (i === currentPage) {
      btn.classList.add("active", "bg-primary", "text-white");
    }

    li.appendChild(btn);
    elPagination.appendChild(li);
  }
}

function getMoviesByPage(page, movieArray = movies) {
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = page * moviesPerPage;
  return movieArray.slice(startIndex, endIndex);
}

function updateMovieListWithPagination(movieArray = movies) {
  totalPages = Math.ceil(movieArray.length / moviesPerPage);
  const paginatedMovies = getMoviesByPage(currentPage, movieArray);
  handleRenderMovie(paginatedMovies);
  renderPaginationButtons();
}

elPagination.addEventListener("click", (evt) => {
  if (evt.target.matches("button")) {
    currentPage = Number(evt.target.dataset.page);
    updateMovieListWithPagination();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateMovieListWithPagination();
});
