export default {
    data() {
      return {
        searchQuery: '', // Define searchQuery in data
      };
    },
    methods: {
      search() {
        const query = this.searchQuery.trim();
        if (query) {
          fetch(`/search/songs?query=${query}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log(data.songs);
              // Handle the response data...
            })
            .catch(error => {
              console.error('Error searching songs:', error);
            });
  
          // Similarly, search for albums...
        } else {
          console.warn('Empty search query');
        }
      },
      async logout() {
        const res = await fetch('/logout');
        if (!res.ok) throw new Error(await res.text());
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        localStorage.removeItem("user-id");
        this.$router.push('/login');
      },
      async registerAsCreator() {
        if (window.confirm("Are you sure you want to become Creator")){
        try {
          const response = await fetch('/api/user/update-role', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            console.log(localStorage.getItem('role'));
            localStorage.setItem("role", "creator");
            console.log(localStorage.getItem('role'));
            alert("You have successfully become a Creator!");
            this.$router.push({ path: "/dashboard" });
          } else {
            console.log(await response.text());
            alert("An error occurred while trying to update your role.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
          alert("An error occurred while trying to update your role.");
        }
      }}
      },
    template: `
      <div class="navbar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #333; color: #fff;">
        <!-- Microphone emoticon -->
        <div class="microphone" style="font-size: 30px; color: yellow;">🎙 Hi Listener</div>
  
        <!-- Navigation links -->
        <div class="nav-links" style="display: flex;">
          <router-link to="/dashboard" style="margin-right: 10px; color: #fff; text-decoration: none;">Dashboard</router-link>
          <router-link to="/playlist" style="margin-right: 10px; color: #fff; text-decoration: none;">Playlist</router-link>
        </div>
  
        <!-- Register as Creator button -->
        <button @click="registerAsCreator" style="background-color: #28a745; color: #fff; border: none; padding: 8px 15px; cursor: pointer;">
          <span style="font-size: 20px;">🎨</span> Register as Creator
        </button>
  
        <!-- Logout button -->
        <button class="logout-button" @click="logout" style="background-color: #c0392b; color: #fff; border: none; padding: 8px 15px; cursor: pointer;">
          <span style="font-size: 20px;">🚫</span> Logout
        </button>
      </div>
    `
  };
  