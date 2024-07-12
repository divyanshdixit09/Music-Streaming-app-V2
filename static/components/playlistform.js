export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top: 1vh">
      <div class="mb-3 p-5 bg-light" style="max-width: 400px;">
        Create Playlist:
        <div class='text-danger'>*{{error}}</div>
        <label for="playlist-name" class="form-label">Playlist Name</label>
        <input type="name" class="form-control" id="playlist-name" placeholder="playlist" v-model="name">
        <button class="btn btn-primary mt-2" @click='addPlaylist' style="width: 100%;">Add Playlist</button>
      </div> 
    </div>
  `,
  data() {
    return {
      name: "",
      error: null,
      user_id: localStorage.getItem('user-id')
    }
  },
  created() {
    const user_id = parseInt(localStorage.getItem('user-id'));
    console.log(typeof(user_id))
  },
  methods: {
    async addPlaylist() {
      console.log(this.name, this.user_id)
      const res = await fetch('/api/user/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.name, user_id: this.user_id }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        this.error = data.message;
      }
    }
  }
}
