import '../style.css';
import StateManager from './state-manager.js';
import SearchForm from './search-form.js';
import MovieList from './movie-list.js'

const stateManager = new StateManager();
const movieList = new MovieList(stateManager);
const searchForm = new SearchForm(stateManager);
searchForm.drawForm();
