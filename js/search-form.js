export default class SearchForm {
    constructor() {

    }

    drawForm () {
        // the job of this method is to display a form to the HTML:
        const formTemplate = `
            <form action="#">
                <h2>Movie Search</h2>
                <div class="row">
                    <label for="title">Title:</label>
                    <input type="text" id="title" placeholder="Title of the movie" required />
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
                    <button type="submit">Search</button>
                </div>
            </form>
        `;
    }

    search() {
        // the job of this method is to send the 
        // search to the cloud (OMDB)

    }

    displayResults() {
        // the job of this method is to display the movie
        // once the response comes back from the cloud
    }
}