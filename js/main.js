import '../style.css';
import StateManager from './state-manager.js';
import SearchForm from './search-form.js';
import MovieList from './movie-list.js'

const stateManager = new StateManager();
const searchForm = new SearchForm(stateManager);
const movieList = new MovieList(stateManager)
searchForm.drawForm();
