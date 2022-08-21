// https://gist.github.com/bspavel/0113a0f473321747b93438e2180f5511

export default class Database {

    constructor (stateManager) {
        this.stateManager   = stateManager;
        this.indexedDB		= window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
	    this.baseName 	    = "movie-database";
	    this.storeName 	    = "movies";
    }

    connectDB (callback){
        // Open (or create) the database
        var request = this.indexedDB.open(this.baseName, 1);
        request.onerror = this.logerr;
        request.onsuccess = function(){
            callback(request.result);
        }
        request.onupgradeneeded = (function (e) {
            let db = e.target.result;
            console.log("running onupgradeneeded");

            // create new data stores:
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, {
                    keyPath: "imdbID"
                });
            }
            this.connectDB(callback);
        }).bind(this);
    }

    getAll(callback){
        this.connectDB((function(db){
            var rows = [],
                store = db.transaction([this.storeName], "readonly").objectStore(this.storeName);
    
            if(store.mozGetAll)
                store.mozGetAll().onsuccess = function(e){
                    callback(e.target.result);
                };
            else
                store.openCursor().onsuccess = function(e) {
                    var cursor = e.target.result;
                    if(cursor){
                        rows.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        callback(rows);
                    }
                };
        }).bind(this));
    }

    addOrUpdate(obj, callback){
        this.connectDB((function(db){
            const transaction = db.transaction([this.storeName], "readwrite");
            const objectStore = transaction.objectStore(this.storeName);
            
            // the "put" method adds or updates
            console.log('updating object in data store:', JSON.stringify(obj))
            const request = objectStore.put(obj);
            request.onerror = function (e) {
                console.log("Error", e.target.error.name);
            };
            request.onsuccess = (function(e){
                console.log("Rows has been added / updated");
                console.log(e);
                console.info(request.result);
                this.getAll(callback);
                // callback(obj);
            }).bind(this);
        }).bind(this));
    }

    remove (id, callback){
        this.connectDB((function(db){
            var transaction = db.transaction([this.storeName], "readwrite");
            var objectStore = transaction.objectStore(this.storeName);
            var objectStoreRequest = objectStore.delete(id);
            objectStoreRequest.onerror = function(err){
                console.error(err);
            }
            objectStoreRequest.onsuccess = (function(){
                console.log("Rows has been deleted: ", id);
                this.getAll(callback);
            }).bind(this);
        }).bind(this));
    }

    get(id, callback){
        this.connectDB((function(db){
            var transaction = db.transaction([this.storeName], "readonly").objectStore(this.storeName).get(id);
            transaction.onerror = function(e){
                console.error(e)
            }
            transaction.onsuccess = function(){
                callback(transaction.result ? transaction.result : -1);
            }
        }).bind(this));
    }
}

//https://habr.com/post/213515/

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 


// function up(obj){//obj with id
// 	del(obj.id,'up');
// 	add(obj,'up');
// }


// //add data
// add({word:'one',data:100});
// add({word:'two',data:200});
// add({word:'three',data:300});
// add({word:'seven',data:700});

// //edit data
// up({word:'five',data:500,id:1});

// //delete
// del(3);

// //get data
// func=function(result){
// 	console.log(result);
// };
// get(1,func);
// getAll(func);