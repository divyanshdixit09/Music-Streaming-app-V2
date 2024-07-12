import navbar from "./navbar.js";
export default {
    template: `<div>
    <navbar />
    <div style="color: #333; padding: 20px;">
    <h1 style="color: #007bff;">Update Song</h1>
    <form @submit.prevent="handleSongUpdate" style="margin-top: 20px;">
        <div style="margin-bottom: 10px;">
            <label for="title" style="margin-right: 10px;">Title:</label>
            <input type="text" v-model="formData.title" :placeholder="song.title" required style="padding: 6px; border: 1px solid #ccc;">
        </div>
        <div style="margin-bottom: 10px;">
            <label for="artist" style="margin-right: 10px;">Artist:</label>
            <input type="text" v-model="formData.artist" :placeholder="song.artist" required style="padding: 6px; border: 1px solid #ccc;">
        </div>
        <div style="margin-bottom: 10px;">
            <label for="genre" style="margin-right: 10px;">Genre:</label>
            <input type="text" v-model="formData.genre" :placeholder="song.genre" required style="padding: 6px; border: 1px solid #ccc;">
        </div>
        <div style="margin-bottom: 10px;">
            <label for="text" style="margin-right: 10px;">Lyrics:</label>
            <textarea v-model="formData.text" :placeholder="song.text" required style="padding: 6px; border: 1px solid #ccc;"></textarea>
        </div>
        <button type="submit" style="background-color: #007bff; color: #fff; border: none; padding: 8px 16px; cursor: pointer;">Update Song</button>
    </form>
</div>
</div>
`,
    data() {
      return {
        formData: {
          title: "",
          artist: "",
          genre: "",
          text: ""
        },
        song:{
            title:"",
            artist: "",
            genre:"",
            text:"",
        },
        error: null,
        userId: localStorage.getItem('user-id'),
      }
    },
    components:{navbar },
    created() {
      // Fetch songs list from API and populate the dropdown
      const id = this.$route.params.id;
      this.fetchSongs(id);
    },
    methods: {
        async handleSongUpdate() {
            try {
              const id = this.$route.params.id;
              const { title, artist, genre, text } = this.formData;
          
              const formData = { title, artist, genre, text };
              console.log('Updating song with ID:', id);
              console.log('Form Data:', formData);
          
              const res = await fetch(`/api/update/song/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  // Include authentication headers if necessary
                },
                body: JSON.stringify(formData)
              });
          
              if (res.status === 400) {
                // Handle 400 error specifically
                const errorData = await res.json();
                console.error('Bad Request Error:', errorData);
                this.error = errorData.message || 'Bad request error';
              } else if (!res.ok) {
                // Handle other types of errors
                const errorData = await res.json();
                console.error('Error updating song:', errorData);
                this.error = errorData.message || 'An error occurred while updating the song.';
              } else {
                // If the response is ok, handle the success case
                const data = await res.json();
                console.log('Song updated successfully:', data.message);
                this.$router.push({ path: "/dashboard" });
              }
            } catch (error) {
              console.error('Error updating song:', error);
              this.error = 'An error occurred while updating the song.';
            }
          },
                   
      async fetchSongs(id) {
        try {
          const response = await fetch(`/api/song_data/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
          const songs = await response.json();
          this.song.title=songs.title
          this.song.artist=songs.artist
          this.song.genre=songs.genre
          this.song.text=songs.text
        } catch (error) {
          console.error('Error fetching songs:', error);
          this.error = 'Failed to fetch songs';
        }
      },
    }
  }
  