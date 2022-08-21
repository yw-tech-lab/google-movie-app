export default class Movie {
    
    constructor(stateManager, movieData) {
        this.stateManager = stateManager;
        this.movieData = movieData;
    }

    attachMovieToDOM(parentElement) {
        // creates and adds a movie to the DOM:
        const html = this.toHTML(this.movieData);
        parentElement.insertAdjacentHTML('beforeend', html);

        // attach an event handler to the .like button:
        const likeButtonSelector = `#like_${this.movieData.imdbID}`;
        document.querySelector(likeButtonSelector).addEventListener('click', this.like.bind(this));
    }

    toHTML(data) {
        // returns an HTML representation of the JSON data
        const movieTemplate = `
            <div class="movie">
                <img src="${data.Poster}">
                <div>
                    <h2>${data.Title}</h2>
                    <p>${data.Year}</p>
                    <p>${data.Plot}</p>
                    <button class="like" id="like_${data.imdbID}">Like</button>
                </div>
            </div>
        `;
        return movieTemplate;
    }

    like (ev) {
        // notifies the state manager that it would like to
        // save the movie to the DB
        console.log('Like: add this data to indexedDB!');
        this.stateManager.notify('like-requested', this.movieData);
    }

    saveComment () {
        // updates the comment after the user has added 
        // some notes.
    }
}