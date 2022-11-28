import React from 'react';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem.js';
import Spotify from '../util/Spotify.js';

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [ {
                id: '',
                name: ''
            }
            ]
        }
    }

componentDidMount() {
        Spotify.getUserPlaylists()
        .then((playlistId, playlistName) => {
            this.setState({
                playlists: [
                    {
                    id: playlistId,
                    name: playlistName
                 } 
                ]
            })
    
        })
    
    }

 render() {
    return  (
     <div className="PlaylistList">
     <h2>Local Playlists</h2>
     <PlaylistListItem playlistId={this.state.playlists.id}
     playlistName={this.state.playlists.name} />
     </div>
    ) 
    }
}

export default PlaylistList; 