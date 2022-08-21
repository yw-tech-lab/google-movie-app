import Movie from './movie.js';

export default class MovieList {

    constructor(stateManager) {
        this.stateManager = stateManager;
        this.stateManager.subscribe('movie-found', this.drawMoviesToScreen.bind(this));
    }

    // this function should fire:
    //    * when the server give back a movie result after they've clicked search.
    drawMoviesToScreen(movieDataList) {
        console.log(movieDataList);
        // the job of this method is to draw all of the 
        // movies to the screen.
        for (let i = 0; i < movieDataList.length; i++) {
            // create movie object
            const movie = new Movie(this.stateManager, movieDataList[i]);

            // the region of the HTML that we want to add our movie.
            const parentElement = document.querySelector(".movies");

            // attach the movie to the DOM:
            movie.attachMovieToDOM(parentElement);

        }
    }

}