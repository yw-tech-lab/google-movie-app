/* 
The state manager's job is to:
    (a) manage the application's data, 
    (b) notify components when critical changes have happened, and 
    (c) allow components to notify it that data has changed.
*/

import Database from './database.js';

export default class StateManager {

    constructor() {
        // initialize the data store.
        // This is our state. When anything changes
        // with any of these variables, we need to 
        // notify our components:
        this.movies = [];
        this.searchResults = [];
        this.favorites = [];
        this.subscribers = []; // so that components can listen for changes to the state
        this.searchMode = true;
        this.showNotes = true;
        this.database = new Database();

        // listening so that any time a "like-requested" event happens, it
        // will call the "saveMovieToFavorites" method.
        this.subscribe('like-requested', this.saveMovieToFavorites.bind(this));
    }

    // A method to read a user's favorites from 
    // IndexedDB when the page first loads.
    loadFavorites() {
        // reads from IndexedDB and stores the 
        // data to this.favorites and notifies
        // any interested components.
    }
    
    // A method to add a new movie to the user's 
    // favorites and save it to IndexedDB.
    saveMovieToFavorites(movieData) {
        // appends the new movie to this.favorites and
        // stores it in the DB.
        console.log("I am about to save the movie to the DB!");
        console.log(movieData);
        this.database.addOrUpdate(movieData, function () {
            console.log('Successfully added to the database');
        });
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