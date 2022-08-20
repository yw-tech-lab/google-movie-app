export default class Movie {
    constructor() {

    }

    toHTML(data) {
        // returns an HTML representation of the JSON data
        const movieTemplate = `
            <div class="movie">
                <h2>${data.Title}</h2>
                <p>${data.Year}</p>
                <img src="${data.Poster}">
                <p>${data.Plot}</p
            </div>
        `;
        return movieTemplate;
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