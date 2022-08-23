export default class Movie {
    
    constructor(stateManager, movieData) {
        this.stateManager = stateManager;
        this.movieData = movieData;
    }

    attachMovieToDOM(parentElement) {
        // creates and adds a movie to the DOM:
        const html = this.toHTML(this.movieData);
        parentElement.insertAdjacentHTML('beforeend', html);

        // attach an event handler to the like button:
        const likeButtonSelector = `#like_${this.movieData.imdbID}`;
        document.querySelector(likeButtonSelector).addEventListener('click', this.like.bind(this));
        
        if (this.stateManager.showNotes) {
            // attach an event handler to the save button:
            const saveButtonSelector = `#save_${this.movieData.imdbID}`;
            console.log(saveButtonSelector);
            document.querySelector(saveButtonSelector).addEventListener('click', this.save.bind(this));
        }
    
    }

    toHTML(data) {
        // returns an HTML representation of the JSON data
        const movieTemplate = `
            <div id="movie_${this.movieData.imdbID}" class="movie">
                <img src="${data.Poster}">
                <div>
                    <h2>${data.Title}</h2>
                    <p>${data.Year}</p>
                    <p>${data.Plot}</p>
                    <div>
                        <button class="like" id="like_${data.imdbID}">Like</button>
                    </div>
                    ${ this.getNotesForm() }
                </div>
            </div>
        `;
        return movieTemplate;
    }

    getNotesForm() {
        if(this.stateManager.showNotes) {
            return `
                <div>
                    <label>Notes</label>
                    <textarea id="comment_${this.movieData.imdbID}">${this.movieData.notes || ''}</textarea>
                    <button id="save_${this.movieData.imdbID}">Save</button>
                </div>
            `;
        } else {
            return '';
        }
    }

    like (ev) {
        // notifies the state manager that it would like to
        // save the movie to the DB
        console.log('Like: add this data to indexedDB!');
        this.stateManager.notify('like-requested', this.movieData);
    }

    save (ev) {
        // notifies the state manager that it would like to
        // save the movie to the DB
        console.log('Save: add comment to movie!');
        const notes = document.querySelector(`#comment_${this.movieData.imdbID}`).value;
        this.movieData.notes = notes;
        console.log(this.movieData);
        this.stateManager.notify('save-requested', this.movieData);
    }

    saveComment () {
        // updates the comment after the user has added 
        // some notes.
    }
}