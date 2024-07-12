import navbar from './navbar.js'
export default {
    template: `
    <div>
    <navbar />
      <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
          <h1>Edit Playlist</h1>
          <div class='text-danger'>*{{error}}</div>
          <label for="album-name" class="form-label">New Album Name</label>
          <input type="name" class="form-control" id="album-name" placeholder="Album" v-model="name">
          <button class="btn btn-primary mt-2" @click='editAlbum'>Edit Album</button>
        </div>
      </div>
      </div>
    `,
    data() {
      return {
        name: "",
        error: null,
      }
    },
    created() {
      const id = this.$route.params.id;
      console.log(id);
      // You can choose to fetch the playlist details here and populate the name field
    },
    components:{navbar},
    methods: {
      async editAlbum() {
        const id = this.$route.params.id; // Get the playlist ID from the route parameters
        console.log(this.name, id);
        const res = await fetch(`/api/edit/album/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: this.name }), // Pass the new name in the request body
        });
        const data = await res.json();
        if (res.ok) {
          this.$router.push({ path: '/uploaded' });
        } else {
          this.error = data.message;
        }
      }
    }
  }
  
