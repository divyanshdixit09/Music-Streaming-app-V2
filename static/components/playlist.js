import navbar from "./navbar.js";
import navbaruser from "./navbaruser.js";
import playlistform from "./playlistform.js";

export default {
  name: "Playlist",
  data() {
    return {
      playlist: [],
      role_bar: "",
      isPlaylistVisible: {},
      playlistDetails: {},
      toggleButtonLabel: {},
      filteredPlaylist: [], // Added for storing filtered playlists
      searchQuery: "",
    };
  },
  created() {
    this.fetchPlaylist();
    this.role_bar = localStorage.getItem('role');
  },
  methods: {
    async fetchPlaylist() {
      try {
        const response = await fetch('/api/playlist');
        if (!response.ok) {
          throw new Error('Failed to fetch playlist');
        }
        this.playlist = await response.json();
        this.filteredPlaylist = this.playlist; // Initialize filteredPlaylist with all playlists
        this.playlist.forEach(p => {
          this.$set(this.isPlaylistVisible, p.id, false);
          this.$set(this.toggleButtonLabel, p.id, "View Playlist");
        });
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    },
    async fetchPlaylistDetails(playlistId) {
      try {
        const response = await fetch(`/api/playlist/${playlistId}/songs`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlist songs');
        }
        this.$set(this.playlistDetails, playlistId, await response.json());
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    },
    async togglePlaylist(playlistId) {
      if (this.isPlaylistVisible[playlistId]) {
        this.isPlaylistVisible[playlistId] = false;
        this.toggleButtonLabel[playlistId] = "View Playlist";
      } else {
        await this.fetchPlaylistDetails(playlistId);
        this.isPlaylistVisible[playlistId] = true;
        this.toggleButtonLabel[playlistId] = "Hide Playlist";
      }
    },
    editPlaylist(playlistId) {
      this.$router.push({path : '/editplaylist/'+playlistId});
      console.log('Edit playlist with ID:', playlistId);
    },
    async deletePlaylist(playlistId) {
      if (window.confirm("Are you sure you want to delete this playlist?")){
      try {
        const res = await fetch(`/api/delete/playlist/${playlistId}`, { method: 'DELETE' });
        if (res.ok) {
         window.location.reload(); 
        } else {
          console.error('Failed to delete playlist');
        }
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
      console.log('Delete playlist with ID:', playlistId);
    }},
    addSongToPlaylist(playlistId) {
      this.$router.push({path : '/addsong/' +playlistId});
      console.log('Add song to playlist with ID:', playlistId);
    },
    async removeTitle(song_id,id) {
      if (window.confirm("Are you sure you want to delete this song from playlist?")) {
      
      try {
          const res = await fetch(`/api/delete/playlist/${id}/song/${song_id}`, { method: 'DELETE' });
          if (res.ok) {
              // Redirect to the playlist page after successful deletion
            window.location.reload(); 
          } else {
              // Handle error cases
              console.error('Failed to delete song');
          }
      } catch (error) {
          console.error('Error deleting song:', error);
      }
    }},
    searchPlaylist() {
      this.filteredPlaylist = this.playlist.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  components: {
    navbar,
    navbaruser,
    playlistform
  },
  computed: {
    viewButtonStyle() {
      return {
        backgroundColor: '#6c757d',
        color: '#fff',
        marginTop: '5px'
      };
    }
  },
  template: `
  <div>
      <div v-if="role_bar === 'creator'" style="margin-bottom: 20px;">
        <navbar />
      </div>
      <div v-else>
      <navbaruser />
      </div>
      <playlistform />
      <br>
      <p></p>
      <div class="d-flex justify-content-center" style="margin-top: 1vh;">
        <input type="text" class="form-control" placeholder="Search Playlist" v-model="searchQuery" @input="searchPlaylist">
      </div>
      <div v-for="p in filteredPlaylist" :key="p.id" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;background-color:#FFDAB9;">
        <div>{{ p.name }}</div>
        <button @click="togglePlaylist(p.id)" :style="viewButtonStyle">{{ toggleButtonLabel[p.id] }}</button>
        <button @click="editPlaylist(p.id)" style="margin-left: 10px;background-color: yellow; color: black;">Edit Playlist</button>
        <button @click="deletePlaylist(p.id)" style="margin-left: 10px;background-color: #dc3545; color: #fff;">Delete Playlist</button>
        <button @click="addSongToPlaylist(p.id)" style="margin-left: 10px;background-color: green; color: #fff">Add Song</button>
        <div v-if="isPlaylistVisible[p.id]" style="margin-top: 10px;">
          <div v-for="title in playlistDetails[p.id]" :key="title.id" style="margin-bottom: 5px;">
            {{ title.title }}
            <button @click="removeTitle(title.id,p.id)" style="margin-left: 5px; background-color: #dc3545; color: #fff;">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `
};
