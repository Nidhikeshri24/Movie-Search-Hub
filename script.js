const API_KEY = 'api_key=255885480bbaf5d5e14885953422250f';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

//all different genres
const genres= [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 99,
        "name": "Documentary"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 36,
        "name": "History"
      },
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "id": 10402,
        "name": "Music"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 10749,
        "name": "Romance"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 10770,
        "name": "TV Movie"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 10752,
        "name": "War"
      },
      {
        "id": 37,
        "name": "Western"
      }
    ]
 
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const tagsEl = document.getElementById('tags');

//pagination

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

//selected genre
let selectedGenre = []
//dynamically add genre 
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
           // call highlight function
           highlightSelection()
        })
        tagsEl.append(t);
    })
}
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    // call clrbutton function
    clearBtn()
    
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}
// function clr after selecting diff genre 
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            // on clicking it will remove genre  and removing dom and getting new url 
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}
// calling getMovies function to fetch movies
getMovies(API_URL);

//fetch movie from API
function getMovies(url) {
  //get last url
    lastUrl = url;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;
                current.innerText = currentPage;
                if(currentPage <= 1){
                  prev.classList.add('disabled');
                  next.classList.remove('disabled')
                }else if(currentPage>= totalPages){
                  prev.classList.remove('disabled');
                  next.classList.add('disabled')
                }else{
                  prev.classList.remove('disabled');
                  next.classList.remove('disabled')
                }
                tagsEl.scrollIntoView({behavior : 'smooth'})
            } else {
                main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
            }
        })
        .catch(err => console.error('Error fetching data:', err));
}


// show the movie that is fetched from API
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, release_date, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'http://via.placeholder.com/1080x1580'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${overview}</p>
                <p><strong>Release Date:</strong> ${release_date}</p>
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `;

        main.appendChild(movieEl);
        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);
        });
    });
}

const overlayContent = document.getElementById('overlay-content');

/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;

  // Fetch movie videos
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY)
      .then(res => res.json())
      .then(videoData => {
          if (videoData) {
              document.getElementById("myNav").style.width = "100%";

              let embed = [];
              let dots = [];

              // Process video data
              if (videoData.results.length > 0) {
                  videoData.results.forEach((video, idx) => {
                      let { name, key, site } = video;

                      if (site === 'YouTube') {
                          embed.push(
                              `<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                          );
                          dots.push(
                              `<span class="dot">${idx + 1}</span>`
                          );
                      }
                  });
              }

              // Fetch movie details
              fetch(BASE_URL + '/movie/' + id + '?' + API_KEY)
                  .then(res => res.json())
                  .then(movieDetails => {
                      // Fetch cast and crew details
                      fetch(BASE_URL + '/movie/' + id + '/credits?' + API_KEY)
                          .then(res => res.json())
                          .then(credits => {
                              const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
                              const genres = movieDetails.genres.map(genre => genre.name).join(', ');
                              const language = movieDetails.original_language.toUpperCase();
                              const rating = movieDetails.vote_average;

                              // Runtime and Director
                              const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A';
                              
                              // Find the director from the crew data
                              const director = credits.crew.find(member => member.job === 'Director');
                              const directorName = director ? director.name : 'Unknown';

                              // Combine movie details and video carousel
                              let content = `
                                  <h1>${movieDetails.title}</h1>
                                  <div class="movie-details">
                                      <p><strong>Cast:</strong> ${cast}</p>
                                      <p><strong>Language:</strong> ${language}</p>
                                      <p><strong>Genres:</strong> ${genres}</p>
                                      <p><strong>IMDb Rating:</strong> ${rating}</p>
                                      <p><strong>Runtime:</strong> ${runtime}</p>
                                      <p><strong>Director:</strong> ${directorName}</p>
                                  </div>
                                  <div class="video-carousel">
                                      ${embed.join('')}
                                      <div class="dots">${dots.join('')}</div>
                                  </div>
                              `;

                              overlayContent.innerHTML = content;

                              // Initialize video carousel
                              activeSlide = 0;
                              showVideos();
                          });
                  });
          }
      });
}


/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length; 
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos()
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})



// function to get color of movie rating 
function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// when the form is submitted
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
// when we search some movie it will remove selected and highlighted genre 
selectedGenre=[];
setGenre();
    if (searchTerm) {
        getMovies(searchURL + '&query=' + encodeURIComponent(searchTerm));
    } else {
        getMovies(API_URL);
    }
});

// set dark and light mode 
const modeToggleBtn = document.getElementById('mode-toggle');
const body = document.body;

modeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        modeToggleBtn.innerText = 'Dark Mode';
    } else {
        modeToggleBtn.innerText = 'Light Mode';
    }
});
// when clicking on prev 
prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})
// when clicking on next 
next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}

