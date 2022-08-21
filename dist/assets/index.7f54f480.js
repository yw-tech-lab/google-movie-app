const l=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}};l();class d{constructor(e){this.stateManager=e,this.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB,this.baseName="movie-database",this.storeName="movies"}connectDB(e){var s=this.indexedDB.open(this.baseName,1);s.onerror=this.logerr,s.onsuccess=function(){e(s.result)},s.onupgradeneeded=function(i){let t=i.target.result;console.log("running onupgradeneeded"),t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:"imdbID"}),this.connectDB(e)}.bind(this)}getAll(e){this.connectDB(function(s){var i=[],t=s.transaction([this.storeName],"readonly").objectStore(this.storeName);t.mozGetAll?t.mozGetAll().onsuccess=function(o){e(o.target.result)}:t.openCursor().onsuccess=function(o){var r=o.target.result;r?(i.push(r.value),r.continue()):e(i)}}.bind(this))}addOrUpdate(e,s){this.connectDB(function(i){const o=i.transaction([this.storeName],"readwrite").objectStore(this.storeName);console.log("updating object in data store:",JSON.stringify(e));const r=o.put(e);r.onerror=function(n){console.log("Error",n.target.error.name)},r.onsuccess=function(n){console.log("Rows has been added / updated"),console.log(n),console.info(r.result),this.getAll(s)}.bind(this)}.bind(this))}remove(e,s){this.connectDB(function(i){var t=i.transaction([this.storeName],"readwrite"),o=t.objectStore(this.storeName),r=o.delete(e);r.onerror=function(n){console.error(n)},r.onsuccess=function(){console.log("Rows has been deleted: ",e),this.getAll(s)}.bind(this)}.bind(this))}get(e,s){this.connectDB(function(i){var t=i.transaction([this.storeName],"readonly").objectStore(this.storeName).get(e);t.onerror=function(o){console.error(o)},t.onsuccess=function(){s(t.result?t.result:-1)}}.bind(this))}}class h{constructor(){this.database=new d,this.movies,this.searchResults=[],this.favorites=[],this.subscribers=[],this.searchMode=!1,this.showNotes=!1,this.loadFavoritesFromDB()}loadFavoritesFromDB(){this.database.getAll(this.refreshFavorites.bind(this))}toggleMode(){this.showNotes?this.showNotes=!1:this.showNotes=!0,this.notify("notes-toggled",this.movies)}saveMovieToFavorites(e){e.timestamp=new Date,this.database.addOrUpdate(e,this.refreshFavorites.bind(this))}refreshFavorites(e){this.favorites=e,this.searchMode=!1,this.movies=this.favorites,this.notify("favorites-reloaded",this.movies)}removeMovieFromFavorites(e){this.database.remove(e,this.refreshFavorites.bind(this))}saveMovieToSearchResults(e){this.searchMode=!0,this.searchResults=[e],this.movies=this.searchResults,this.notify("movie-found",this.movies)}reset(){this.searchMode=!1,this.movies=this.favorites,this.notify("mode-switched",this.movies)}notify(e,s){for(let i=0;i<this.subscribers.length;i++){const t=this.subscribers[i],o=t[0],r=t[1];e==o&&r(s)}}subscribe(e,s){this.subscribers.push([e,s])}}const u="9977bdef";class m{constructor(e,s){this.stateManager=e,this.data=s}toHTML(){const e=this.data;let s="Like";return this.stateManager.searchMode||(s="Unlike"),`
            <div class="movie">
                <div>
                    <img src="${e.Poster}">
                    <button class="like" id="like_${this.data.imdbID}">${s}</button>
                </div>
                <div class="info">                
                    <h2>${e.Title}</h2>
                    <p>${e.Year}</p>
                    <p>${e.Plot}</p>
                    ${this.getNotes(e)}
                </div>
            </div>
        `}attachLikeFunctionality(){console.log(`#like_${this.data.imdbID}`),document.querySelector(`#like_${this.data.imdbID}`).addEventListener("click",e=>{e.currentTarget.innerHTML=="Like"?(console.log("Like",this.data),this.stateManager.saveMovieToFavorites(this.data)):(console.log("Unlike",this.data.imdbID),this.stateManager.removeMovieFromFavorites(this.data.imdbID))}),this.stateManager.showNotes&&document.querySelector(`#save_${this.data.imdbID}`).addEventListener("click",e=>{console.log(`notes_${this.data.imdbID}`);const s=document.querySelector(`#notes_${this.data.imdbID}`).value;console.log(s),this.data.notes=s,console.log(JSON.stringify(this.data)),this.stateManager.saveMovieToFavorites(this.data)})}getNotes(e){return this.stateManager.showNotes&&!this.stateManager.searchMode?`
                <p>Notes:</p>
                <textarea id="notes_${this.data.imdbID}">${e.notes||""}</textarea>
                <button class="save" id="save_${this.data.imdbID}">Save</button>
            `:""}like(){}saveComment(){}}class v{constructor(e){this.stateManager=e}drawForm(){const e=`
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
        `;document.querySelector(".form-container").innerHTML=e,document.querySelector("form").addEventListener("submit",this.search.bind(this)),document.querySelector("#reset").addEventListener("click",this.reset.bind(this))}search(e){e.preventDefault();const s=document.querySelector("#title").value,i=document.querySelector("#plot").value,t=document.querySelector("#year").value;let o=`http://www.omdbapi.com/?apikey=${u}&t=${s}&plot=${i}`;t!=""&&(o+=`y=${t}`),console.log(o),fetch(o).then(r=>r.json()).then((r=>{console.log(r),this.stateManager.saveMovieToSearchResults(r)}).bind(this))}reset(e){e.preventDefault(),console.log("reset"),this.stateManager.reset()}}class b{constructor(e){this.stateManager=e,this.stateManager.subscribe("favorites-reloaded",this.redraw.bind(this)),this.stateManager.subscribe("mode-switched",this.redraw.bind(this)),this.stateManager.subscribe("movie-found",this.redraw.bind(this)),this.stateManager.subscribe("notes-toggled",this.redraw.bind(this))}redraw(e){const s=document.querySelector(".movies");s.innerHTML="";for(let i=0;i<e.length;i++){const t=e[i],o=new m(this.stateManager,t);s.insertAdjacentHTML("beforeend",o.toHTML()),o.attachLikeFunctionality()}this.stateManager.searchMode||(s.insertAdjacentHTML("afterbegin",`
                <button id="edit">${this.stateManager.showNotes?"Hide Notes":"Show Notes"}</button>
            `),document.querySelector("#edit").addEventListener("click",this.toggle.bind(this)))}toggle(){this.stateManager.toggleMode()}}const c=new h,f=new v(c);new b(c);f.drawForm();
