export default{
    template:`<div>
    <div v-for= "title in title" :key="title.id">
    {{ title.title }}
    </div>
    </div>`,
    data() {
        return {
          title: '',
        };
      },
      created() {
        const id = this.$route.params.id;
        this.fetchAlbumSongs(id);
      },
      methods: {
        async fetchAlbumSongs(id) {
          try {
            const response = await fetch(`api/album/${id}/songs`);
            if (!response.ok) {
              throw new Error('Failed to fetch songs');
            }
            this.title = await response.json();
          } catch (error) {
            console.error('Error fetching songs:', error);
          }
        }
    
    }

        }  
