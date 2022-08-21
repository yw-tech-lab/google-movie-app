export default class Movie {
    constructor(stateManager, data) {
        this.stateManager = stateManager;
        this.data = data;
    }

    toHTML() {
        // returns an HTML representation of the JSON data
        const data = this.data;
        let buttonText = 'Like';
        if(!this.stateManager.searchMode) {
            buttonText = 'Unlike';
        }
        const movieTemplate = `
            <div class="movie">
                <div>
                    <img src="${data.Poster}">
                    <button class="like" id="like_${this.data.imdbID}">${buttonText}</button>
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
        document.querySelector(`#like_${this.data.imdbID}`).addEventListener('click', ev => {
            if(ev.currentTarget.innerHTML == 'Like') {
                console.log('Like', this.data);
                this.stateManager.saveMovieToFavorites(this.data);
            }
            else {
                console.log('Unlike', this.data.imdbID);
                this.stateManager.removeMovieFromFavorites(this.data.imdbID);
            }
        });

        if (this.stateManager.showNotes) {
            document.querySelector(`#save_${this.data.imdbID}`).addEventListener('click', ev => {
                console.log(`notes_${this.data.imdbID}`);
                const notes = document.querySelector(`#notes_${this.data.imdbID}`).value;
                console.log(notes);
                this.data.notes = notes;
                console.log(JSON.stringify(this.data));
                this.stateManager.saveMovieToFavorites(this.data);
            });
        }
    }

    getNotes(data) {
        if (this.stateManager.showNotes && !this.stateManager.searchMode) {
            return `
                <p>Notes:</p>
                <textarea id="notes_${this.data.imdbID}">${data.notes || ''}</textarea>
                <button class="save" id="save_${this.data.imdbID}">Save</button>
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