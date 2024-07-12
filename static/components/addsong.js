import navbar from "./navbar.js";
import navbaruser from "./navbaruser.js";
export default {
    template: `
    <div>
    <div v-if="role_bar === 'creator'" style="margin-bottom: 20px;">
    <navbar />
  </div>
  <div v-else>
    <navbaruser />
  </div>
    <div class="container mt-5" style="color: #333;">
    <h2 style="color: #007bff;">Add Song to Playlist</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="song-select" class="form-label">Select Song</label>
          <select class="form-select" id="song-select" v-model="selectedSong">
            <option v-for="song in songs" :key="song.id" :value="song.id">{{ song.title }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="addSong" style="background-color: #28a745; border-color: #28a745;">Add Song</button>
        <div class="text-danger mt-3">{{ error }}</div>
      </div>
    </div>
  </div>
  </div>
  
    `,
    data() {
      return {
        selectedSong: null,
        songs: [], // Assuming you fetch the songs list from an API
        error: '',
        playlist_id: this.$route.params.id,
        role_bar: localStorage.getItem("role")
        
      };
    },
    created() {
      // Fetch songs list from API and populate the dropdown
      this.fetchSongs();
    },
    methods: {
      async fetchSongs() {
        try {
          const response = await fetch('/api/song_data');
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
          this.songs = await response.json();
        } catch (error) {
          console.error('Error fetching songs:', error);
          this.error = 'Failed to fetch songs';
        }
      },
      async addSong() {
        try {
          // Ensure a song is selected
          if (!this.selectedSong) {
            this.error = 'Please select a song';
            return;
          }
          const response = await fetch('/api/add-song-to-playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              song_id: this.selectedSong,
              playlist_id : this.$route.params.id
            })
          });
          const data = await response.json();
          if (response.ok) {
            // Redirect or show success message
            this.$router.push({path : '/playlist'})
                  } else {
            this.error = data.message || 'Failed to add song to playlist';
          }
        } catch (error) {
          console.error('Error adding song to playlist:', error);
          this.error = 'Failed to add song to playlist';
        }
      }
    },
    components: {
      navbar,
      navbaruser,
  }}
  