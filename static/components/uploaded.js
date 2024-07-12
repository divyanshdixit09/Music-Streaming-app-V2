import creatoralbum from './creatoralbum.js';
import navbar from './navbar.js';
export default {
  template: `
   <div style="color: #333; padding: 20px;">
   <navbar />
  <h1 style="color: #007bff;">Uploaded Albums:</h1>
  <creatoralbum />
  <br>
  <h1 style="color: #007bff;">Uploaded Songs:</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f8f9fa;">
        <th style="padding: 8px; border: 1px solid #dee2e6;">ID</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Title</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Artist</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Genre</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Rating</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Edit</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="song in filteredSongs" :key="song.id">
        <td style="padding: 8px; border: 1px solid #dee2e6;">{{ song.id }}</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">
          <router-link :to="'/lyrics/' + song.id" style="color: #007bff; text-decoration: none;">
            {{ song.title }}
          </router-link>
        </td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">{{ song.artist }}</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">{{ song.genre }}</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">{{ song.rating }}</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;"><button style="background-color: #28a745; color: #fff; border: none; padding: 6px 12px; cursor: pointer;" @click="editSong(song.id)">Edit</button></td>
        <td style="padding: 8px; border: 1px solid #dee2e6;"><button style="background-color: #dc3545; color: #fff; border: none; padding: 6px 12px; cursor: pointer;" @click="deleteSong(song.id)">Delete</button></td>
      </tr>
    </tbody>
  </table>

  <router-link to="/upload"><button style="background-color: #007bff; color: #fff; border: none; padding: 8px 16px; margin-top: 20px; cursor: pointer;">Upload Song</button></router-link>
  <router-link to="/uploadalbum"><button style="background-color: #007bff; color: #fff; border: none; padding: 8px 16px; margin-top: 20px; cursor: pointer;">Upload Album</button></router-link>
</div>

  `,
  components: {

    creatoralbum,
    navbar
  },
  data() {
    return {
      songs: [],
      id: null
    };
  },
  created() {
    this.fetchSongs();
    this.id = localStorage.getItem('user-id'); // Use `this.id` instead of `id`
  },
  computed: {
    filteredSongs() {
      // Filter songs based on the creator_id
      console.log(this.id);
      return this.songs.filter(song => song.creator_id == this.id);
    }
  },
  methods: {
    async fetchSongs() {
      try {
        const response = await fetch('/api/song_data');
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        const songs = await response.json();
        for (const song of songs) {
          song.rating = await this.getRating(song.id);
        }
        this.songs = songs;
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    },
    async getRating(songId) {
      try {
        const response = await fetch(`/api/songs/${songId}/ratings`);
        if (!response.ok) {
          throw new Error("Failed to fetch rating");
        }
        const data = await response.json();
        return data.value || 0;
      } catch (error) {
        console.error('Error fetching rating:', error);
        return 0;
      }
    },
    editSong(songId) {
      this.$router.push({ path: `/editsong/${songId}` });
    },
    deleteSong(songId) {
      if (window.confirm("Are you sure you want to delete this playlist?")) {
      fetch(`/api/delete/song/${songId}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            window.location.reload();
          }
        })
        .catch(error => {
          console.error('Error deleting song:', error);
        });
    }},
   
  }
};
