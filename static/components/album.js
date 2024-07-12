export default {
    template: `
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div v-for="album in albums" :key="album.id" @click="toggleSongsVisible(album.id)" style="width: calc(33.33% - 20px); cursor: pointer; margin-bottom: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); background-color: #FFDAB9;">
          <h2 style="padding: 20px;">{{ album.name }}</h2>
          <div v-if="visibleAlbumId === album.id" style="margin-left: 20px;">
            <div v-for="title in titles" :key="title.id">
              {{ title.title }}
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        albums: [],
        visibleAlbumId: null,
        titles: [],
      };
    },
    created() {
      this.fetchAlbum();
    },
    methods: {
      async fetchAlbum() {
        try {
          const response = await fetch('/api/album_data');
          if (!response.ok) {
            throw new Error('Failed to fetch albums');
          }
          this.albums = await response.json();
        } catch (error) {
          console.error('Error fetching albums:', error);
        }
      },
      async fetchAlbumSongs(id) {
        try {
          const response = await fetch(`api/album/${id}/songs`);
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
          this.titles = await response.json();
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      },
      async toggleSongsVisible(albumId) {
        if (this.visibleAlbumId === albumId) {
          this.visibleAlbumId = null;
          this.titles = []; // Clear titles when hiding
        } else {
          this.visibleAlbumId = albumId;
          await this.fetchAlbumSongs(albumId); // Fetch songs when showing
        }
      },
    },
  };
  