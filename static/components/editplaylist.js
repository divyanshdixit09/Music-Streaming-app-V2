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
    <div class='d-flex justify-content-center' style="margin-top: 25vh;">
      <div class="mb-3 p-5 bg-light" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Edit Playlist</h1>
        <div class='text-danger' style="margin-bottom: 10px;">*{{error}}</div>
        <label for="playlist-name" class="form-label">New Playlist Name</label>
        <input type="name" class="form-control" id="playlist-name" placeholder="Playlist" v-model="name" style="margin-bottom: 10px;">
        <button class="btn btn-primary" @click='editPlaylist' style="width: 100%;">Edit Playlist</button>
      </div>
    </div>
  </div>
  
  
    `,
    data() {
      return {
        name: "",
        error: null,
        role_bar: localStorage.getItem("role")
      }
    },
    created() {
      const id = this.$route.params.id;
      console.log(id);
      // You can choose to fetch the playlist details here and populate the name field
    },
    methods: {
      async editPlaylist() {
        const id = this.$route.params.id; // Get the playlist ID from the route parameters
        console.log(this.name, id);
        const res = await fetch(`/api/edit/playlist/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: this.name }), // Pass the new name in the request body
        });
        const data = await res.json();
        if (res.ok) {
          this.$router.push({ path: '/playlist' });
        } else {
          this.error = data.message;
        }
      }
    },
    components: {
      navbar,
      navbaruser
    }
  }
  
