export default class Movie {
    constructor(stateManager, data) {
        this.stateManager = stateManager;
        this.data = data;
    }

    addToDOM(container) {
        const html = this.toHTML();
        container.insertAdjacentHTML('beforeend', html);

        // attach "like / unlike" event handler
        const likeButton = document.querySelector(`#movie_${this.data.imdbID} .like`);
        likeButton.addEventListener('click', this.likeUnlike.bind(this));
        
        // attach "save notes" event handler
        if (this.stateManager.showNotes) {
            const saveButton = document.querySelector(`#movie_${this.data.imdbID} .save`);
            saveButton.addEventListener('click', this.saveNotes.bind(this));
        }
    }

    likeUnlike(ev) {
        if(ev.currentTarget.innerHTML == 'Like') {
            this.stateManager.saveMovieToFavorites(this.data);
        }
        else {
            this.stateManager.removeMovieFromFavorites(this.data.imdbID);
        }
    }

    saveNotes(ev) {
        const notes = document.querySelector(`#movie_${this.data.imdbID} textarea`).value;
        this.data.notes = notes;
        this.stateManager.saveMovieToFavorites(this.data);
    }

    toHTML() {
        // returns an HTML representation of the JSON data
        const data = this.data;
        const searchMode = this.stateManager.searchMode;

        const movieTemplate = `
            <div class="movie" id="movie_${this.data.imdbID}">
                <div>
                    <img src="${data.Poster}">
                    <button class="like">${searchMode ? 'Like' : 'Unlike'}</button>
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

    getNotes(data) {
        if (this.stateManager.showNotes && !this.stateManager.searchMode) {
            return `
                <p>Notes:</p>
                <textarea class="notes" id="notes_${this.data.imdbID}">${data.notes || ''}</textarea>
                <button class="save" id="save_${this.data.imdbID}">Save</button>
            `;
        } else {
            // return `<p>${data.notes || ''}</p>`;
            return ``;
        };
    }

}