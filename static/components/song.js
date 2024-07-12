export default {
  template: `
  <div>
  <h1 style="margin-bottom: 20px;">All Songs</h1>
  <input type="text" v-model="searchQuery" placeholder="Search songs...">
  <div style="display: flex; flex-wrap: wrap; gap: 20px;">
    <div v-for="song in filteredSongs" :key="song.id" style="background-color: peachpuff; border-radius: 10px; padding: 20px; width: calc(33.33% - 20px); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 10px;">
        <h3 @click="toggleTextVisibility(song.id)">{{ song.title }}</h3> <!-- Bind click event to toggle text visibility -->
        <p><strong>Artist:</strong> {{ song.artist }}</p>
        <p><strong>Genre:</strong> {{ song.genre }}</p>
        <p><strong>Rating:</strong> {{ getRating(song.id) }}</p>
        <!-- Display song text if visible -->
        <div v-if="visibleText === song.id">
          <p><strong>Lyrics:</strong> {{ song.text }}</p>
        </div>
      </div>
      <div style="display: flex; align-items: center;">
        <div>
          <input type="radio" v-model="selectedRating[song.id]" :value="0"> 0
          <input type="radio" v-model="selectedRating[song.id]" :value="1"> 1
          <input type="radio" v-model="selectedRating[song.id]" :value="2"> 2
          <input type="radio" v-model="selectedRating[song.id]" :value="3"> 3
          <input type="radio" v-model="selectedRating[song.id]" :value="4"> 4
          <input type="radio" v-model="selectedRating[song.id]" :value="5"> 5
          <button @click="submitRating(song.id)" style="background-color: #007bff; color: #fff; border: none; padding: 5px 10px; margin-left: 10px; cursor: pointer;">Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      songs: [],
      ratings: {}, 
      selectedRating: {},
      visibleText: null ,
      searchQuery: ''
    };
  },
  created() {
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
        // Fetch ratings for each song
        this.songs.forEach(song => {
          this.getAverageRating(song.id).then(rating => {
            this.$set(this.ratings, song.id, rating);
            // Initialize selectedRating to the current rating or 0 if not rated
            this.$set(this.selectedRating, song.id, rating || 0);
          });
        });
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    },
    async getAverageRating(songId) {
      try {
        const response = await fetch(`/api/songs/${songId}/ratings`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ratings for song ${songId}`);
        }
        const rating = await response.json();
        if (!rating || typeof rating.value !== 'number') {
          throw new Error(`Invalid ratings data for song ${songId}`);
        }
        return rating.value;
      } catch (error) {
        console.error(`Error fetching ratings for song ${songId}:`, error);
        return 0;
      }
    },
    async submitRating(songId) {
      const ratingValue = this.selectedRating[songId];
      try {
        // Send a request to submit the rating
        const response = await fetch(`/api/songs/${songId}/ratings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: ratingValue }),
        });
        if (!response.ok) {
          throw new Error(`Failed to submit rating for song ${songId}`);
        }
        // Update the ratings data after successful submission
        this.$set(this.ratings, songId, ratingValue)
        window.location.reload();
      } catch (error) {
        console.error(`Error submitting rating for song ${songId}:`, error);
      }
    },
    async toggleTextVisibility(songId) {
      // Toggle text visibility for clicked song
      if (this.visibleText === songId) {
        this.visibleText = null; // Hide text if already visible
      } else {
        this.visibleText = songId; // Show text for clicked song
      }
    },
  },
  computed: {
    filteredSongs() {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.songs.filter(song => {
        return (
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.genre.toLowerCase().includes(query) ||
          this.getRating(song.id) === parseFloat(query)
        );
      });
      console.log("Filtered songs:", filtered);
      return filtered;
    },
    getRating() {
      return songId => this.ratings[songId] || 0;
    },
  },
};
