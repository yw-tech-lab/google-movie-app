/* 
The state manager's job is to:
    (a) manage the application's data, 
    (b) notify components when critical changes have happened, and 
    (c) allow components to notify it that data has changed.
*/

export default class StateManager {

    constructor() {
        // initialize the data store.
        // This is our state. When anything changes
        // with any of these variables, we need to 
        // notify our components:
        this.movies;
        this.searchResults = [];
        this.favorites = [];
        this.subscribers = []; // so that components can listen for changes to the state
        this.searchMode = false;
        this.showNotes = false;
        
        this.subscribe('database-loaded', this.loadFavorites.bind(this));
        this.loadDatabase();
    }

    // A method to read a user's favorites from 
    // IndexedDB when the page first loads.
    // loadFavorites() {
    //     // reads from IndexedDB and stores the 
    //     // data to this.favorites and notifies
    //     // any interested components.
    //     this.favorites = [];
    //     this.movies = this.favorites;
    //     this.notify('favorites-loaded', this.movies);
    // }

    toggleMode() {
        if (this.showNotes) {
            this.showNotes = false;
        } else {
            this.showNotes = true;
        }
        this.notify('notes-toggled', this.movies);
    }
    
    // A method to add a new movie to the user's 
    // favorites and save it to IndexedDB.
    saveMovieToFavorites(movieData) {
        // appends the new movie to this.favorites and
        // stores it in the DB.
    }

    saveMovieToSearchResults(movie) {
        this.searchMode = true;
        this.movies = this.searchResults; 
        this.movies.push(movie);
        this.notify('movie-added', this.movies);
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

    saveMovie(movie) {
        // "push" method of an array appends an item to the bottom
        var openRequest = indexedDB.open("movie-database", 1);
        openRequest.onsuccess = function (e) {
            console.log("running onsuccess");
            let db = e.target.result;
            // call this function to create a new comment:

            var transaction = db.transaction(["movies"], "readwrite");
            var comments = transaction.objectStore("movies");
            var request = comments.add(movie);

            request.onerror = function (e) {
                console.log("Error", e.target.error.name);
            };
            request.onsuccess = function (e) {
                console.log("The comment has been successfully added!");
                this.movies = this.favorites;
                this.movies.push(movie);
                this.notify('movie-added', this.movies);
            }.bind(this);

            // Commit: close connection
            transaction.oncomplete = () => {
                db.close();
            };
        }.bind(this);
    }

    loadDatabase() {
        // let db;

        var openRequest = indexedDB.open("movie-database", 1);

        // 1. This function created our new data store:
        openRequest.onupgradeneeded = function (e) {
            let db = e.target.result;
            console.log("running onupgradeneeded");

            // create new data stores:
            if (!db.objectStoreNames.contains("movies")) {
                db.createObjectStore("movies", {
                    keyPath: "imdbID"
                });
            }
        }.bind(this);

        // 2. This function fires when the database has been opened.
        // This is where we will add new comments to the datastore:
        openRequest.onsuccess = function (e) {
            let db = e.target.result;
            // this.readCommentsFromDataStore(db);
            this.notify('database-loaded', db);
        }.bind(this);
    }

    loadFavorites(db) {
        var transaction = db.transaction("movies", "readonly");
        var objectStore = transaction.objectStore("movies");
        var cursorRequest = objectStore.openCursor();
        var movieList = [];
        cursorRequest.onsuccess = (function (event) {
            if (event.target.result) {
                movieList.push(event.target.result.value);
                event.target.result["continue"]();
            }
        }).bind(this);

        transaction.oncomplete = function (event) {
            this.favorites = movieList;
            this.searchMode = false;
            this.notify('favorites-loaded', movieList);
        }.bind(this);
    }

}