let accessToken;
let userId;
const clientId = 'f03fa9fb4a2c4106b3a086f362dee076';
const redirectUri="http://localhost:3000/";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '',expiresIn*1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;

        }
    },
    
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: { Authorization: `Bearer ${accessToken}` }})
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

//At the top of Spotify.js, we will instantiate a variable called userId with no value. Then inside Spotify.getCurrentUserId(), we will check to see if userId's value is already set (from a previous call to the function). If it is, we will create and return a promise that will resolve to that value. Otherwise we will make the call to the /me endpoint and return that request's promise. Once our .getCurrentUserId() is written, we should use it in both Spotify.savePlaylist() and our new method, Spotify.getUserPlaylists(). 
    getCurrentUserId() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
         if(userId){ //check if userId has a value
            let promise = new Promise((resolve) => { //create a promise which resolves to userId value
                resolve(userId);
            })
            promise.then(()=>{return userId});
            console.log(userId);
        } 
        else { //otherwise make a call to the /me endpoint to grab userId
            return fetch('https://api.spotify.com/v1/me', { headers: headers }
            ).then(
                response => {
                if(response.ok){
                    return response.json(); //converts the response to json
                        } else {
                           console.log('API has failed');
                                } 
                                   }
                                        ).then(
                                            jsonResponse => {
                                                userId = jsonResponse.id;
            })
        }
    },

    savePlaylist(name, trackUris) {
        //checks if name (aka playlistName) or arr have a value, if not it will return.
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        
        let getUserId = Spotify.getCurrentUserId();
        console.log(getUserId); //retrieve userId
        getUserId.then(() => {
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, //once userId has been called then make the call to /playlists endpoint
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris})
                })
            })
        })
    },

    //To retrieve playlists, we will create a new method, Spotify.getUserPlaylists(), that hits the https://api.spotify.com/v1/users/{user_id}/playlists endpoint. As we can see, this endpoint requires the user ID. We created getCurrentUserId() method above. once the user ID has been retrieved, we can make our call to the /users/{user_id}/playlists endpoint. Upon completion of this request, we will update the current playlist's state to an array of the returned playlists. Rather than storing the entire playlists, we should create and store objects for each playlist that contain the playlistId and name of each playlist (the API will not return that playlist's tracks, thus we will need to use the playlist ID later to retrieve those tracks).
    getUserPlaylists() {
    // Retrieve the user's ID
      const currentUserId = Spotify.getCurrentUserId()
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}`};
           let playlistId; 
           let playlistName; 
   
         return fetch("https://api.spotify.com/v1/me", {
               headers
           }).then((response) => response.json()).then((jsonResponse) => {
               userId = jsonResponse.id; 
               console.log(jsonResponse.id); 
   
      // Make a call to the /users/{user_id}/playlists endpoint.Upon completion of this request, we will update the current playlist's state to an array of the returned playlists. Rather than storing the entire playlists, we should create and store objects for each playlist that contain the playlistId and name of each playlist (below using the map method)
        const proxyurl = "https://corsanywhere.herokuapp.com/"; 
        const url = `https://api.spotify.com/v1/users/${currentUserId}/playlists`; 
      return fetch((proxyurl + url), {
        headers: headers
        }).then((response) => { 
       response.json();
        }).then((jsonResponse) => { 
            jsonResponse.playlist.items.map((playlist) => ({
             playlistId: playlist.items.id,
             playlistName: playlist.items.name  
         }));
         console.log(jsonResponse.playlists.items); 

     }).catch(error => console.log('This error occurred', error.toString())); 
 })
}
}

export default Spotify;