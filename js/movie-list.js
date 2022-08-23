import Movie from './movie.js';

export default class MovieList {

    constructor(stateManager) {
        this.stateManager = stateManager;
        this.stateManager.subscribe('clear-everything', this.clear.bind(this));
        this.stateManager.subscribe('favorites-loaded', this.drawMoviesToScreen.bind(this));
        this.stateManager.subscribe('movie-found', this.drawMoviesToScreen.bind(this));
        this.stateManager.subscribe('redraw', this.drawMoviesToScreen.bind(this));
    }

    // this function should fire:
    //    * when the server give back a movie result after they've clicked search.
    drawMoviesToScreen(movieDataList) {
        console.log(movieDataList);
        this.clear();

        // the region of the HTML that we want to add our movie.
        const parentElement = document.querySelector(".movies");

        // the job of this method is to draw all of the 
        // movies to the screen.
        for (let i = 0; i < movieDataList.length; i++) {
            // create movie object
            const movie = new Movie(this.stateManager, movieDataList[i]);

            // attach the movie to the DOM:
            movie.attachMovieToDOM(parentElement);
        }
        // adding the show notes button to the top:
        let buttonText = "Show Notes";
        if(this.stateManager.showNotes) {
            buttonText = "Hide Notes";
        }
        const buttonHTML = `<button id="show_notes">${buttonText}</button>`;
        parentElement.insertAdjacentHTML('afterbegin', buttonHTML);

        document.querySelector('#show_notes').addEventListener('click', this.toggleNotes.bind(this));
    }

    toggleNotes(ev) {
        ev.preventDefault();
        const btn = document.querySelector('#show_notes');
        if(this.stateManager.showNotes) { 
            // notify the state manager
            this.stateManager.notify('show-notes', false);
        } else {
            // notify the state manager
            this.stateManager.notify('show-notes', true);
        }
    }

    clear() {
        document.querySelector('.movies').innerHTML = "";
    }

}