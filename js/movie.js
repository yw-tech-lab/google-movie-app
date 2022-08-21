export default class Movie {
    constructor(stateManager, data) {
        this.stateManager = stateManager;
        this.data = data;
    }

    toHTML() {
        // returns an HTML representation of the JSON data
        const data = this.data;
        const movieTemplate = `
            <div class="movie">
                <div>
                    <img src="${data.Poster}">
                    <button class="like" id="like_${this.data.imdbID}">Like</button>
                </div>
                <div class="info">                
                    <h2>${data.Title}</h2>
                    <p>${data.Year}</p>
                    <p>${data.Plot}</p>
                    ${this.getNotes(data)}
                </div>
            </div>
        `;
        return movieTemplate;
    }

    attachLikeFunctionality() {
        console.log(`#like_${this.data.imdbID}`);
        document.querySelector(`#like_${this.data.imdbID}`).addEventListener('click', () => {
            console.log('Like', this.data);
            this.stateManager.saveMovie(this.data);
        });
        // document.querySelector(`#like_${this.data.imdbID}`).addEventListener('click', () => {alert('hi')});
    }

    like(ev) {
        // ev.preventDefault();
        console.log('Like', this.data);
        // this.stateManager.saveMovie(this.data);
    }

    getNotes(data) {
        if (this.stateManager.showNotes) {
            return `
                <p>Notes:</p>
                <textarea>${data.Notes || ''}</textarea>
                <br>
                <button class="save">Save</button>
            `;
        } else {
            return ``;
        };
    }

    like () {
        // notifies the state manager that it would like to
        // save the movie to the DB

    }

    saveComment () {
        // updates the comment after the user has added 
        // some notes.
    }
}