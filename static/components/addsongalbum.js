import navbar from './navbar.js'
export default {
    template: `
    <div>
    <navbar />
    <div class="container mt-5" style="color: #333;">
    <h2 style="color: #007bff;">Add Song to Album</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="song-select" class="form-label">Select Song</label>
          <select class="form-select" id="song-select" v-model="selectedSong" style="padding: 6px; border: 1px solid #ccc;">
            <option v-for="song in songs" :key="song.id" :value="song.id">{{ song.title }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="addSong" style="background-color: #007bff; color: #fff; border: none; padding: 8px 16px; cursor: pointer;">Add Song</button>
        <div class="text-danger mt-3" style="color: red;">{{ error }}</div>
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
        album_id: this.$route.params.id
      };
    },
    components:{navbar },
    created() {
      // Fetch songs list from API and populate the dropdown
      this.fetchSongs();
    },
    methods: {
      async fetchSongs() {
        try {
          const response = await fetch('/api/particular');
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
          this.songs = await response.json();
          console.log(this.songs)
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
          const response = await fetch('/api/add-song-to-album', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              song_id: this.selectedSong,
              album_id : this.$route.params.id
            })
          });
          const data = await response.json();
          if (response.ok) {
            // Redirect or show success message
            this.$router.push({path : '/uploaded'})
                  } else {
            this.error = data.message || 'Failed to add song to album';
          }
        } catch (error) {
          console.error('Error adding song to album:', error);
          this.error = 'Failed to add song to album';
        }
      }
    }
  }
  