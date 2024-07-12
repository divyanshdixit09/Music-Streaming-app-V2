import song from './song.js';
import album from './album.js';
import navbaruser from './navbaruser.js'
import audioplayer from './audioplayer.js';

export default {
  template : `<div> 
  <navbaruser />
    <song />
    <audioplayer />
    <p><h1>All Albums</h1></p>
    <album />

    <p></p>
    

  </div>`,
  components: {

    song, // Define the song component
    album,
    navbaruser,
    audioplayer
  },
  methods: {
  }
}

