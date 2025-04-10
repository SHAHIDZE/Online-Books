movies = movies.slice(0, 50);

const elMovieList = document.querySelector(".js-movie-list");
const elMovieTemp = document.querySelector(".js-movie-template").content;
const elModalBody = document.querySelector(".js-modal-body");
const elModal = document.querySelector(".js-movie-modal");
const elForm = document.querySelector(".js-form");
const elSearchInp = document.querySelector(".js-search-input");
const elCategoriesSelect = document.querySelector(".js-categories-select");
const elMinYearInput = document.querySelector(".js-min-year-input");
const elMaxYearInput = document.querySelector(".js-max-year-input");
const elSortSelect = document.querySelector(".js-sort-select");
const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
const elBookmarkList = document.querySelector(".js-canvas-body");

document.addEventListener("DOMContentLoaded", () => {
    handleRenderBookmarks();
});

elMovieList.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-bookmark")) {
        let movieId = evt.target.closest(".js-movie-item").querySelector(".js-more-info").dataset.id;
        const findMovie = movies.find((movie) => movie.imdb_id == movieId);
        toggleBookmark(findMovie);
    }
});

function handleRenderBookmarks() {
    elBookmarkList.innerHTML = "";
    bookmarks.forEach((movie) => {
        let bookmarkItem = document.createElement("li");
        bookmarkItem.classList.add("text-center", "border-bottom", "mb-2", "pb-2", "w-75", "mx-auto");
        bookmarkItem.innerHTML = `
            <img class="rounded js-movie-image" src="${movie.img_url}" width="150" alt="Movie">
            <h4 class="js-movie-name fs-5 m-0">${movie.title}</h4>
            <button class="js-remove-bookmark btn btn-danger mt-2" data-id="${movie.imdb_id}">Delete</button>
        `;
        elBookmarkList.appendChild(bookmarkItem);
    });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function toggleBookmark(movie) {
    const index = bookmarks.findIndex((item) => item.imdb_id === movie.imdb_id);
    if (index === -1) {
        bookmarks.push(movie);
    } else {
        bookmarks.splice(index, 1);
    }
    handleRenderBookmarks();
}

elBookmarkList.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-remove-bookmark")) {
        let movieId = evt.target.dataset.id;
        const index = bookmarks.findIndex((item) => item.imdb_id === movieId);
        if (index !== -1) {
            bookmarks.splice(index, 1);
            handleRenderBookmarks();
        }
    }
});


const handleMovieDate = (runtime) => {
    let hours = Math.floor(runtime / 60);
    let minutes = Math.floor(runtime) % 60;
    return `${hours} hr ${minutes} min`
}

const handleRenderMovie = (arr, regex = '') => {
    const docFragment = document.createDocumentFragment();
    elMovieList.innerHTML = '';
    arr.forEach((movie) => {
        let clone = elMovieTemp.cloneNode(true);
        if(regex && regex.source !== "(?:)"){
            clone.querySelector(".js-movie-title").innerHTML = movie.title.replaceAll(regex, (match) => {
                return `<mark>${match}</mark>`
            });
        }else{
            clone.querySelector(".js-movie-title").textContent = movie.title.split(" ").slice(0, 3).join(" ").concat("...");
        };
        clone.querySelector(".js-movie-year").textContent = movie.movie_year;
        clone.querySelector(".js-movie-runtime").textContent = handleMovieDate(movie.runtime);
        clone.querySelector(".js-movie-categories").textContent = movie.categories.join(", ");
        clone.querySelector(".js-movie-rating").textContent = movie.imdb_rating
        clone.querySelector(".js-movie-image").src = movie.img_url
        clone.querySelector(".js-more-info").dataset.id = movie.imdb_id;
        docFragment.append(clone);
    });
    elMovieList.append(docFragment);
} 
handleRenderMovie(movies)


const handleRenderModal = (movie) => {
    elModalBody.querySelector(".js-movie-iframe").src = movie.movie_frame;
    elModalBody.querySelector(".js-movie-modal-title").textContent = movie.title;
    elModalBody.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
    elModalBody.querySelector(".js-movie-year").textContent = movie.movie_year;
    elModalBody.querySelector(".js-movie-runtime").textContent = handleMovieDate(movie.runtime);
    elModalBody.querySelector(".js-movie-summary").textContent = movie.summary
    elModalBody.querySelector(".js-movie-text").textContent = movie.categories.join(", ")
    elModalBody.querySelector(".js-movie-imdb").href = movie.imdb_link
}

elMovieList.addEventListener("click", (evt) => {
    if(evt.target.matches(".js-more-info")){
        let movieId = evt.target.dataset.id;
        const findMovie = movies.find((movie) => movie.imdb_id == movieId);
        handleRenderModal(findMovie)
    }
})

elModal.addEventListener("hide.bs.modal" , function(){
    elModalBody.querySelector(".js-movie-iframe").src = "";
});

function handleFilterCategories (arr){
    let store = [];
    for (const movie of arr) {
        const categories = movie.categories;
        for (const categorie of categories) {
            if(!(store.includes(categorie))){
                store.push(categorie)
            }
        }
    }
    handleRenderOption(store)
}

handleFilterCategories(movies);

function handleRenderOption (categories){
    categories.forEach((categorie) => {
        let newOption = document.createElement("option");
        newOption.value = categorie;
        newOption.textContent = categorie
        elCategoriesSelect.append(newOption)
    })
}

const handleSearchMovie = (regex, searchVal) => {
   let filterMovies;
    let result = movies.filter((movie) => {
        filterMovies = (searchVal == "" ||  movie.title.match(regex)) && 
        (elMinYearInput.value == "" || movie.movie_year >= elMinYearInput.value) && 
        (elMaxYearInput.value == "" || movie.movie_year <= elMaxYearInput.value) && 
        (elCategoriesSelect.value == "all" || movie.categories.includes(elCategoriesSelect.value))
        return filterMovies
    });
    return result   
}
var username = "sasasa"
console.log(username);

const sortMoviesObj = {
    ["a-z"]: function(a, b){
        const movieTitleCode = a.title.toLowerCase().charCodeAt(0);
        const movieTitleCharCode = b.title.toLowerCase().charCodeAt(0);
        if(movieTitleCode > movieTitleCharCode) return 1
        else return -1
    },
    ["z-a"]: function(a, b){
        const movieTitleCode = a.title.toLowerCase().charCodeAt(0);
        const movieTitleCharCode = b.title.toLowerCase().charCodeAt(0);
        if(movieTitleCode < movieTitleCharCode) return 1
        else return -1
    },
    ["old-year"]: function(a, b){
        const movieYear = new Date(a.movie_year);
        const movieYearTue = new Date(b.movie_year);
        if(movieYear > movieYearTue) return 1
        else return -1
    },
    ["new-year"]: function(a, b){
        const movieYear = new Date(a.movie_year);
        const movieYearTue = new Date(b.movie_year);
        if(movieYear < movieYearTue) return 1
        else return -1
    },
};


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const searchVal = elSearchInp.value.trim();
    const regex = new RegExp(searchVal, "gi");
    if(elSortSelect.value){
        movies.sort(sortMoviesObj[elSortSelect.value]);
    };
    let searchMovies = handleSearchMovie(regex, searchVal);
    
    handleRenderMovie(searchMovies, regex)
})
