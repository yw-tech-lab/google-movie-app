/* 
The state manager's job is to:
    (a) manage the application's data, 
    (b) notify components when critical changes have happened, and 
    (c) allow components to notify it that data has changed.
*/
import Database from './datastore.js'

export default class StateManager {

    constructor() {
        // initialize the data store.
        // This is our state. When anything changes
        // with any of these variables, we need to 
        // notify our components:
        this.database = new Database();
        this.movies;
        this.searchResults = [];
        this.favorites = [];
        this.subscribers = []; // so that components can listen for changes to the state
        this.searchMode = false;
        this.showNotes = false;        
        this.loadFavoritesFromDB();
    }

    loadFavoritesFromDB() {
        this.database.getAll(this.refreshFavorites.bind(this));
    }

    toggleMode() {
        if (this.showNotes) {
            this.showNotes = false;
        } else {
            this.showNotes = true;
        }
        this.notify('notes-toggled', this.movies);
    }
    
    saveMovieToFavorites(movie) {
        // appends the new movie to this.favorites and
        // stores it in the DB.
        if (!movie.timestamp) {
            movie.timestamp = new Date();
        } else {
            movie.lastUpdated = new Date();
        }
        this.database.addOrUpdate(movie, this.refreshFavorites.bind(this));
    }

    refreshFavorites(updatedFavoritesList) {
        this.favorites = updatedFavoritesList;
        this.searchMode = false;
        this.movies = this.favorites;
        this.notify('favorites-reloaded', this.movies);
    }

    removeMovieFromFavorites(imdbID) {
        this.database.remove(imdbID, this.refreshFavorites.bind(this));
    }

    saveMovieToSearchResults(movie) {
        this.searchMode = true;
        this.searchResults = [movie];
        this.movies = this.searchResults; 
        this.notify('movie-found', this.movies);
    }

    reset() {
        this.searchMode = false;
        this.movies = this.favorites;  
        this.notify('mode-switched', this.movies);
    }
    
    // A method to notify any interested components that 
    // something has changed. 
    notify(eventName, data) {
        // loops through all of the subscribers
        // and invokes the subscriber's function if they're interested
        // in the particular event.
        for (let i = 0; i < this.subscribers.length; i++) {
            const subscriber = this.subscribers[i];
            
            const subscriberEvent = subscriber[0];
            const callbackFunction = subscriber[1];

            // is the event that was just fired something that
            // the subscriber is interested in?
            if (eventName == subscriberEvent) {
                callbackFunction(data);
            }
        }
    }

    subscribe(eventName, callbackFunction) {
        // when a component wants to subscribe to the stateManager, 
        // they need to tell the SM which event they're interested in,
        // and what should happen if that event is fired (callback Function).
        this.subscribers.push([eventName, callbackFunction]);
    }

}