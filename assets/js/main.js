const key = `15e383204c1b8a09dbfaaa4c01ed7e17`;
let popularURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`;
// Contenedor de peliculas
const products = document.querySelector(".movies-container");
// Titulo de pelis
const productsText = document.querySelector(".movies-title");
// Boton pagina siguiente
const nextBTN = document.querySelectorAll(".btn-next");
// Boton pagina anterior
const prevBTN = document.querySelectorAll(".btn-prev");
// Texto pagina actual
const currentPage = document.querySelectorAll(".current-page");
// Container watchlist
const watchlistContainer = document.querySelector(".watchlist-container");
// watchlist btn
const watchlistBtn = document.querySelector(".fav-btn");
// Corazon de movies
const movieFav = document.querySelectorAll(".fav-btn");
// const deleteBtn = document.querySelector(".delete-btn");
// ! Seteando local storage
let watchLocal = JSON.parse(localStorage.getItem("watch")) || [];

// Funcion para guardar el carrito en el localStorage
const saveLocalStorage = (watchlist) => {
    localStorage.setItem("watch", JSON.stringify(watchlist));
};
// ! Trayendo peliculas de la api y pintando en el HTML
const requestMovies = async() => {
    const response = await fetch(popularURL);
    const data = await response.json();
    // console.log(data.results);

    data.results.forEach((movie) => {
        const { id, title, poster_path, release_date } = movie;
        // console.log(movie);
        const div = document.createElement("div");
        div.classList.add("movie");
        div.innerHTML = `
        
        <div class="movie-img">
            <img src="https://www.themoviedb.org/t/p/w220_and_h330_face/${poster_path}" alt="" />
        </div>
        <div class="movie-text">
            <h4>${title}</h4>
            <p>(${release_date})</p>
        </div>
        <div class="movie-btn">
            <button class="btn-add btn-add-${id}" data-id="${id}" data-title="${title}" data-img="https://www.themoviedb.org/t/p/w220_and_h330_face/${poster_path}" data-year="${release_date}" id="btn-add-${id}">
            <i class="fa-solid fa-heart fav-btn"></i>
    </button>
        </div>
    `;
        products.appendChild(div);
    });
};

// ! Paginacion
let page = 1;
currentPage.forEach((p) => {
    p.innerText = `${page}`;
});

const nextPage = () => {
    nextBTN.forEach((nextbtn) => {
        nextbtn.addEventListener("click", () => {
            prevBTN.forEach((prevbtn) => {
                prevbtn.classList.remove("disabled");
            });
            page++;
            popularURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=${page}`;
            products.innerHTML = ``;
            currentPage.forEach((p) => {
                p.innerText = `${page}`;
            });
            requestMovies(popularURL);
        });
    });
};
const prevPage = () => {
    prevBTN.forEach((button) => {
        button.addEventListener("click", () => {
            if (page === 1) {
                return;
            }
            page--;
            if (page === 1) {
                prevBTN.forEach((btn) => {
                    btn.classList.add("disabled");
                });
            }
            popularURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=${page}`;
            products.innerHTML = "";
            currentPage.forEach((p) => {
                p.innerText = `${page}`;
            });
            requestMovies(popularURL);
        });
    });
};
// ! Watchlist

const renderWatchlistMovie = (movie) => {
    const { id, title, poster_path, release_date } = movie;
    return `
        <div class="swiper-slide">
        <img src="https://www.themoviedb.org/t/p/w220_and_h330_face/${poster_path}" alt="Poster de ${title}" />
        <div class="watchlist__movie-info">
            <h3 class="watchlist__movie-title">${title}</h3>
            <p class="watchlist__movie-date">(${release_date})</p>
        </div>
        <i class="fa-solid fa-trash-can" data-id="${id}"></i>
        </div>
    `;
};
let watchlist = [...watchLocal];
const renderWatchlist = (watchlist) => {
    if (watchlist.length <= 16) {
        watchlistContainer.innerHTML = watchlist.map(renderWatchlistMovie).join("");
    } else {
        return;
    }
};
// Boton para agregar
const addProduct = (e) => {
    e.preventDefault();
    if (!e.target.classList.contains("btn-add")) return;
    const peli = {
        id: e.target.dataset.id,
        title: e.target.dataset.title,
        release_date: e.target.dataset.year,
        poster_path: e.target.dataset.img,
    };
    const existsInWatchlist = watchlist.find((item) => item.id === peli.id);
    if (existsInWatchlist) {
        alert("Esta pelicula ya se encuentra en tu watchlist");
        return;
    } else {
        watchlist = [...watchlist, {...peli }];
    }
    saveLocalStorage(watchlist);
    renderWatchlist(watchlist);
};
const showWatchlist = () => {
    watchlistContainer.classList.toggle("show");
};
const watchlistLength = () => {
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = `<p>Tu watchlist esta vacia`;
    }
};
// Fav Color
const favColored = (e) => {
    if (!e.target.classList.contains("btn-add")) return;
    const peli = {
        id: e.target.dataset.id,
        title: e.target.dataset.title,
        release_date: e.target.dataset.year,
        poster_path: e.target.dataset.img,
    };
    const favBtn = document.getElementById(`btn-add-${peli.id}`);
    favBtn.classList.add("faved");
};

// Delete watchlist
const deteleWatchlist = (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
        const existsInWatchlist = watchlist.find(
            (item) => item.id === e.target.dataset.id
        );
        console.log(existsInWatchlist);
        if (existsInWatchlist) {
            if (window.confirm("Desea eliminar esta pelicula de su watchlist?")) {
                watchlist = watchlist.filter(
                    (peli) => peli.id !== existsInWatchlist.id
                );
                renderWatchlist(watchlist);
                saveLocalStorage(watchlist);
                watchlistLength();
            }
        }
    }
};
const navBar = document.querySelector(".navbar");
// Favorite color
const favColor = () => {
    watchlistBtn.classList.toggle("red-btn");
    navBar.classList.toggle("open-watchlist");
};

// Funcion que inicializa todas las demas funciones
const init = () => {
    document.addEventListener("DOMContentLoaded", renderWatchlist(watchLocal));
    document.addEventListener("DOMContentLoaded", watchlistLength);
    watchlistBtn.addEventListener("click", showWatchlist);
    watchlistContainer.addEventListener("click", deteleWatchlist);
    watchlistBtn.addEventListener("click", favColor);
    requestMovies(popularURL);
    prevPage();
    nextPage();
    products.addEventListener("click", addProduct);
    products.addEventListener("click", favColored);
};
init();