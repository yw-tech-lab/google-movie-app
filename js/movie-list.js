import Movie from './movie.js';

export default class MovieList {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.stateManager.subscribe('favorites-reloaded', this.redraw.bind(this));
        this.stateManager.subscribe('mode-switched', this.redraw.bind(this));
        this.stateManager.subscribe('movie-found', this.redraw.bind(this));
        this.stateManager.subscribe('notes-toggled', this.redraw.bind(this));
    }

    redraw(movieDataList) {
        const moviesContainer = document.querySelector('.movies');
        moviesContainer.innerHTML = '';
        
        for (let i = 0; i < movieDataList.length; i++) {
            const movieData = movieDataList[i];
            const movie = new Movie(this.stateManager, movieData);
            moviesContainer.insertAdjacentHTML('beforeend', movie.toHTML());
            movie.attachLikeFunctionality();
        }
        if (!this.stateManager.searchMode) {
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