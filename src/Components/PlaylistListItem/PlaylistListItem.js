import React from 'react';

class PlaylistListItem extends React.Component {
  render() {
    return (
    <div className="PlaylistListItems">
    <div className="playlist-info">
      {this.props.playlistId}
     <h3>{this.props.playlistName}</h3>
    </div>
    </div>
    )
    
  }
}

export default PlaylistListItem;