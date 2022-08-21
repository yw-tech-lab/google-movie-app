import key from './key.js';
import Movie from './movie.js';

export default class SearchForm {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }

    drawForm () {
        // the job of this method is to display a form to the HTML:
        const formTemplate = `
            <form action="#">
                <h2>Movie Search</h2>
                <div class="row">
                    <label for="title">Title:</label>
                    <input type="text" id="title" 
                        placeholder="Title of the movie" 
                        value="Rush Hour"
                        required />
                </div>
                <div class="row">
                    <label for="year">Year (optional):</label>
                    <input
                        type="text"
                        maxlength="4"
                        minlength="4"
                        id="year"
                        placeholder="Year movie was made"
                    />
                </div>
                <div class="row">
                    <label for="plot">Plot details:</label>
                    <select id="plot">
                        <option value="short">Short</option>
                        <option value="full">Full</option>
                    </select>
                </div>
            
                <div class="row">
                    <button type="submit" class="btn-movie-search">Search</button>
                    <button id="reset">Reset</button>
                </div>
            </form>
        `;
        document.querySelector('.form-container').innerHTML = formTemplate;
        document.querySelector('form').addEventListener('submit', this.search.bind(this));
        document.querySelector('#reset').addEventListener('click', this.reset.bind(this));
    }

    search (ev) {
        // the job of this method is to send the 
        // search to the cloud (OMDB)
        ev.preventDefault();
        const title = document.querySelector('#title').value;
        const plot = document.querySelector('#plot').value;
        const year = document.querySelector('#year').value;
        let url = `http://www.omdbapi.com/?apikey=${key}&t=${title}&plot=${plot}`;
        if (year != '') {
            url += `y=${year}`;
        }
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then((data => {
                console.log(data);
                this.stateManager.saveMovieToSearchResults(data);
            }).bind(this));
    }

    reset(ev) {
        ev.preventDefault();
        console.log('reset');
        this.stateManager.reset();
    }
}