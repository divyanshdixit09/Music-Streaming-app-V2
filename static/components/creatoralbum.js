// export default {
//     template:`<div> 
//     <div v-for="a in albums" :key="a.id">
//    <h2>{{ a.name }}</h2>
//    <button @click="viewAlbumSongs(a.id)" class="btn btn-primary">View Song</button>
//     </div>
//   </div>`,
        
//     data:function(){
//             return{
//                 albums:[],
//             }
//         },
//         created(){

//             this.fetchAlbum();
//         },
//         methods: {
//             async viewAlbumSongs(album_id) {
//                 console.log(album_id);
//                 this.$router.push(`/albumcreator/${album_id}/songs`);
//               },
//         async fetchAlbum() {
//             try{
//             const response = await fetch('/api/creator_album_data');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch albums');
//             }
//             this.albums = await response.json();
//             console.log(this.albums);
//             } catch (error) {
//         console.error('Error fetching albums:', error);
//         }
// }
// }
// }
export default {
    template: `
    <div>
    <p>
    <div v-for="a in album" :key="a.id" style="margin-bottom: 20px;">
      <div style="color: #333; background-color: #f8f9fa; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
        {{ a.name }}
        <button @click="editAlbum(a.id)" style="background-color: #007bff; color: #fff; border: none; padding: 6px 12px; margin-left: 10px; cursor: pointer;">Edit Album</button>
        <button @click="deleteAlbum(a.id)" style="background-color: #dc3545; color: #fff; border: none; padding: 6px 12px; margin-left: 10px; cursor: pointer;">Delete Album</button>
        <button @click="addSongToAlbum(a.id)" style="background-color: #28a745; color: #fff; border: none; padding: 6px 12px; margin-left: 10px; cursor: pointer;">Add Song</button>
        <button @click="viewAlbum(a.id)" style="background-color: #6c757d; color: #fff; border: none; padding: 6px 12px; margin-left: 10px; cursor: pointer;">View Album</button>
      </div>
    </div>
  </p>
    </div>
  
    `,
    data() {
      return {
        album: [],
      };
    },
    created() {
      this.fetchAlbum();
    },
    methods: {
      async fetchAlbum() {
        try {
          const response = await fetch('/api/creator_album_data');
          if (!response.ok) {
            throw new Error('Failed to fetch album');
          }
          this.album = await response.json();
        } catch (error) {
          console.error('Error fetching album:', error);
        }
      },
      editAlbum(albumId) {
        // Implement your edit functionality here
        this.$router.push({path : '/editalbum/'+albumId});

        console.log('Edit album with ID:', albumId);
      },
      deleteAlbum(albumId) {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
         const res = fetch(`/api/delete/album/${albumId}`, { method: 'DELETE' })
            if (res.ok){window.location.reload()}
         // Implement your delete functionality here
        console.log('Delete album with ID:', albumId);
      }},
      addSongToAlbum(albumId) {
        // Implement your add song functionality here
        this.$router.push({path : '/addalbumsong/' +albumId});
        console.log('Add song to album with ID:', albumId);
      },
      viewAlbum(albumId) {
        // Implement your add song functionality here
        this.$router.push({path : '/viewalbumsong/' +albumId});
        console.log('Add song to album with ID:', albumId);
      }
    }
  }
  

        