export default {
    data() {
      return {
        // You can define any data properties here if needed
      };
    },
    methods: {
      // Define methods here if needed
      search() {
        
      },
      async logout() {
        const res = await fetch('/logout')
         if(!res.ok) throw new Error(await res.text());
         localStorage.removeItem( "auth-token")
         localStorage.removeItem("role")
         localStorage.removeItem("user-id")
 
         this.$router.push('/login')
      }},
    template: `
      <div class="navbar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #333; color: #fff;">
        <!-- Microphone emoticon -->
        <div class="microphone" style="font-size: 30px; color: yellow;">🎙 Hi Creator</div>
  
        <!-- Navigation links -->
        <div class="nav-links" style="display: flex;">
          <router-link to="/dashboard" style="margin-right: 10px; color: #fff; text-decoration: none;">Dashboard</router-link>
          <router-link to="/uploaded" style="margin-right: 10px; color: #fff; text-decoration: none;">Uploaded Files</router-link>
          <router-link to="/playlist" style="margin-right: 10px; color: #fff; text-decoration: none;">Playlist</router-link>
        </div>
  
        <!-- Logout button -->
        <button class="logout-button" @click="logout" style="background-color: #c0392b; color: #fff; border: none; padding: 8px 15px; cursor: pointer;">
          <span style="font-size: 20px;">🚫</span> Logout
        </button>
      </div>
    `
  };
  