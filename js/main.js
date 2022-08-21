import '../style.css';
import StateManager from './state-manager.js';
import SearchForm from './search-form.js';
import MovieList from './movie-list.js';

const stateManager = new StateManager();


// Below, we're passing the state manager into the form
// so that the form can let the state manager know
// when it's received search results:
const searchForm = new SearchForm(stateManager);
searchForm.drawForm();

const movieList = new MovieList(stateManager);
