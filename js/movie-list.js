import Movie from './movie.js';

export default class MovieList {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.stateManager.subscribe('movie-added', this.redraw.bind(this));
        this.stateManager.subscribe('mode-switched', this.redraw.bind(this));
        this.stateManager.subscribe('favorites-loaded', this.redraw.bind(this));
        this.stateManager.subscribe('notes-toggled', this.redraw.bind(this));
    }

    redraw(movieDataList) {
        const moviesContainer = document.querySelector('.movies');
        moviesContainer.innerHTML = `
            <button id="edit">${this.stateManager.showNotes ? 'Hide Notes' : 'Show Notes'}</button>
        `;
        for (let i = 0; i < movieDataList.length; i++) {
            const movieData = movieDataList[i];
            const movie = new Movie(this.stateManager, movieData);
            moviesContainer.insertAdjacentHTML('beforeend', movie.toHTML());
            movie.attachLikeFunctionality();
        }
        document.querySelector("#edit").addEventListener('click', this.toggle.bind(this));
    }

    toggle() {
        this.stateManager.toggleMode();
    }

}