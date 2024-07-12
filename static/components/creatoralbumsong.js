import navbar from "./navbar.js";
export default{
  template:`<div>
  <navbar />
  <div v-for="title in title" :key="title.id" style="margin-bottom: 10px; font-weight: bold; color: #333;">
    {{ title.title }}
    <button @click="removeTitle(title.id)" style="background-color: #dc3545; color: #fff; border: none; padding: 4px 8px; cursor: pointer; margin-left: 10px;">Remove</button> 
  </div>
</div>
`,
  data() {
      return {
        title: '',
      };
    },
    created() {
      const id = this.$route.params.id;
      this.fetchalbumsong(id);
    },
    components:{navbar },
    methods: {
      async fetchalbumsong(id) {
        try {
          const response = await fetch(`api/album/${id}/songs`);
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
          this.title = await response.json();
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      },
      async removeTitle(song_id) {
          const id = this.$route.params.id;
          try {
              const res = await fetch(`/api/delete/album/${id}/song/${song_id}`, { method: 'DELETE' });
              if (res.ok) {
                  // Redirect to the playlist page after successful deletion
                  this.$router.push({ path: '/uploaded' });
              } else {
                  // Handle error cases
                  console.error('Failed to delete song');
              }
          } catch (error) {
              console.error('Error deleting song:', error);
          }
      }
      
      }
  }