export default{
    template:`<div>YOUR SONGS:
    <div v-for="title in title" :key="title.id">
            {{ title.title }}
            <button @click="removeTitle(title.id)">Remove</button> 
        </div>
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
        this.fetchplaylistsong(id);
      },
      methods: {
        async fetchplaylistsong(id) {
          try {
            const response = await fetch(`api/playlist/${id}/songs`);
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
                const res = await fetch(`/api/delete/playlist/${id}/song/${song_id}`, { method: 'DELETE' });
                if (res.ok) {
                    // Redirect to the playlist page after successful deletion
                    this.$router.push({ path: '/playlist' });
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