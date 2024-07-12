import song from './song.js';
import album from './album.js';
import navbar from './navbar.js'
import audioplayer from './audioplayer.js';

export default {
  template : `<div>
  <navbar />
    <song />
    <p></p>
    <audioplayer />
    <p></p>
    <br></br>
    <h1 class="text-center">All Albums</h1>
    <album />
  </div>`,
  components: {

    song, 
    album,
    navbar,
    audioplayer
  }
  }