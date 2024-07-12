export default {
  template: `
  <div style="color: #333; padding: 20px;">
  <h1 style="color: #007bff;">Upload Song</h1>
  <form @submit.prevent="handleSongUpload" style="margin-top: 20px;">
    <div style="margin-bottom: 10px;">
      <label for="title" style="margin-right: 10px;">Title:</label>
      <input type="text" v-model="formData.title" required style="padding: 6px; border: 1px solid #ccc;">
    </div>
    <div style="margin-bottom: 10px;">
      <label for="artist" style="margin-right: 10px;">Artist:</label>
      <input type="text" v-model="formData.artist" required style="padding: 6px; border: 1px solid #ccc;">
    </div>
    <div style="margin-bottom: 10px;">
      <label for="genre" style="margin-right: 10px;">Genre:</label>
      <input type="text" v-model="formData.genre" required style="padding: 6px; border: 1px solid #ccc;">
    </div>
    <div style="margin-bottom: 10px;">
      <label for="text" style="margin-right: 10px;">Lyrics:</label>
      <input type="text" v-model="formData.text" required style="padding: 6px; border: 1px solid #ccc;">
    </div>
    <button type="submit" style="background-color: #007bff; color: #fff; border: none; padding: 8px 16px; cursor: pointer;">Upload Song</button>
  </form>
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
      error: null,
      user_id: localStorage.getItem('user-id')
    }
  },
  methods: {
    async handleSongUpload() {
      try {
        const { title, artist, genre, text } = this.formData;

        const formData = { title, artist, genre, text };

        const res = await fetch('api/song_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
          // Song uploaded successfully
          console.log(data.message);
          this.$router.push({path :"/dashboard"})
        } else {
          // Error handling
          this.error = data.message;
        }
      } catch (error) {
        console.error('Error uploading song:', error);
        this.error = 'An error occurred while uploading the song.';
      }
    }
  }
}
