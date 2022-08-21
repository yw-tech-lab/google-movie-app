import Movie from './movie.js';

export default class MovieList {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.stateManager.subscribe('movie-found', this.redraw.bind(this));
        this.stateManager.subscribe('movie-not-found', this.displayError.bind(this));
        this.stateManager.subscribe('favorites-reloaded', this.redraw.bind(this));
        this.stateManager.subscribe('mode-switched', this.redraw.bind(this));
        this.stateManager.subscribe('notes-toggled', this.redraw.bind(this));
    }

    displayError (errorMessage) {
        const moviesContainer = document.querySelector('.movies');
        moviesContainer.innerHTML = `<p>${errorMessage} Please try again.</p>`;
    }

    redraw(movieDataList) {
        const moviesContainer = document.querySelector('.movies');
        moviesContainer.innerHTML = '';
        
        for (let i = 0; i < movieDataList.length; i++) {
            const movieData = movieDataList[i];
            const movie = new Movie(this.stateManager, movieData);
            movie.addToDOM(moviesContainer);
        }

        // add an edit button if we're looking at the favorites:
        if (!this.stateManager.searchMode && movieDataList.length > 0) {
            moviesContainer.insertAdjacentHTML('afterbegin', `
                <button id="edit">${this.stateManager.showNotes ? 'Hide Notes' : 'Show Notes'}</button>
            `);
            document.querySelector("#edit").addEventListener('click', this.toggle.bind(this));
        }
    }

    toggle() {
        this.stateManager.toggleMode();
    }

}