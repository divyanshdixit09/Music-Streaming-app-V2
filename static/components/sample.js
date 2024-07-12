import navbaradmin from "./navbaradmin.js";

export default {
    data() {
        return {
            users: [],
            songs: [],
            flaggedsongs: [],
            albums: [],
            topThreeSongs: [],
            albumSearchQuery: '', // Initialize album search query
        };
    },
    async mounted() {
        await this.fetchUserData();
        await this.fetchSongData();
        await this.fetchAlbumData();
        await this.fetchTopThreeSongs();
    },
    methods: {
        updateSongs(songs) {
            this.songs = songs;
        },
        async fetchUserData() {
            try {
                const response = await fetch('/api/registration');
                const data = await response.json();
                this.users = data;
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
        toggleUserStatus(user) {
            user.active = !user.active;
            const user_id = user.id;
            fetch(`/api/blacklist/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: user.active }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user status');
                }
            })
            .catch(error => {
                console.error('Error updating user status:', error);
                user.active = !user.active;
            });
        },
        async flagSong(song) {
            const song_id = song.id;
            const newFlagValue = !song.flag;
            try {
                const response = await fetch(`/api/flag/${song_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ flag: newFlagValue }),
                });
                if (!response.ok) {
                    throw new Error('Failed to flag song');
                }
                song.flag = newFlagValue;
            } catch (error) {
                console.error('Error flagging song:', error);
            }
        },
        async fetchSongData() {
            try {
                const response = await fetch('/api/song_data');
                const data = await response.json();
                this.songs = data;
            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        },
        async removeSong(song) {
            try {
                if (confirm(`Are you sure you want to delete the song "${song.title}"?`)) {
                    const response = await fetch(`/api/delete/song/${song.id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to remove song');
                    }
                    const index = this.songs.indexOf(song);
                    if (index !== -1) {
                        this.songs.splice(index, 1);
                    }
                }
            } catch (error) {
                console.error('Error removing song:', error);
            }
        },
        async fetchAlbumData(query = '') {
            try {
                const response = await fetch(`/search/albums?query=${query}`);
                const data = await response.json();
                this.albums = data.albums;
            } catch (error) {
                console.error('Error fetching album data:', error);
            }
        },
        async removeAlbum(album) {
            try {
                if (confirm(`Are you sure you want to delete the album "${album.name}"?`)) {
                    const response = await fetch(`api/delete/album/${album.id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to remove album');
                    }
                    const index = this.albums.indexOf(album);
                    if (index !== -1) {
                        this.albums.splice(index, 1);
                    }
                }
            } catch (error) {
                console.error('Error removing album:', error);
            }
        },
        async fetchTopThreeSongs() {
            try {
                const response = await fetch('/api/top_three_songs');
                const data = await response.json();
                this.topThreeSongs = data;
            } catch (error) {
                console.error('Error fetching top three songs:', error);
            }
        },
        async fetchSongRatings(songId) {
            try {
                const response = await fetch(`/api/songs/${songId}/ratings`);
                const data = await response.json();
                return data.value;
            } catch (error) {
                console.error('Error fetching song ratings:', error);
                return 0;
            }
        },
        searchAlbums() {
            this.fetchAlbumData(this.albumSearchQuery);
        },
    },
    template: `
    <div class="admin-dashboard" style="background-color: #f5f5f5; padding: 20px;">
        <div>
            <navbaradmin @search-results="updateSongs" />
        </div>
        <!-- User Management -->
    <div class="user-management">
        <h2 style="color: #333; text-align: center;">User Management</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
            <thead>
                <tr style="border-bottom: 1px solid #ccc;">
                    <th style="padding: 10px; text-align: center;">User ID</th>
                    <th style="padding: 10px; text-align: center;">Email</th>
                    <th style="padding: 10px; text-align: center;">Status</th>
                    <th style="padding: 10px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 10px; text-align: center;">{{ user.id }}</td>
                    <td style="padding: 10px; text-align: center;">{{ user.email }}</td>
                    <td style="padding: 10px; text-align: center;">{{ user.active ? 'Active' : 'Inactive' }}</td>
                    <td style="padding: 10px; text-align: center;">
                        <button @click="toggleUserStatus(user)" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">{{ user.active ? 'Deactivate' : 'Activate' }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Song Management -->
    <div class="song-management">
        <h2 style="color: #323; text-align: center;">Song Management</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
            <thead>
                <tr style="border-bottom: 1px solid #ccc;">
                    <th style="padding: 10px; text-align: center;">Song ID</th>
                    <th style="padding: 10px; text-align: center;">Title</th>
                    <th style="padding: 10px; text-align: center;">Artist</th>
                    <th style="padding: 10px; text-align: center;">Flagged</th>
                    <th style="padding: 10px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="song in songs" :key="song.id" style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 10px; text-align: center;">{{ song.id }}</td>
                    <td style="padding: 10px; text-align: center;">{{ song.title }}</td>
                    <td style="padding: 10px; text-align: center;">{{ song.artist }}</td>
                    <td style="padding: 10px; text-align: center;">{{ song.flag ? 'Yes' : 'No' }}</td>
                    <td style="padding: 10px; text-align: center;">
                        <button @click="flagSong(song)" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">{{ song.flag ? 'Unflag' : 'Flag' }}</button>
                        <button @click="removeSong(song)" style="padding: 5px 10px; background-color: #dc3545; color: #fff; border: none; cursor: pointer;">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
        
        <!-- User Management -->
        <!-- Song Management -->
        <div class="song-management">
            <!-- Album Management -->
            <div class="album-management">
                <h2 style="color: #333; text-align: center;">Album Management</h2>
                <input type="text" v-model="albumSearchQuery" @input="searchAlbums" placeholder="Search albums...">
                <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
                    <thead>
                        <tr style="border-bottom: 1px solid #ccc;">
                            <th style="padding: 10px; text-align: center;">Album ID</th>
                            <th style="padding: 10px; text-align: center;">Name</th>
                            <th style="padding: 10px; text-align: center;">User ID</th>
                            <th style="padding: 10px; text-align: center;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="album in albums" :key="album.id" style="border-bottom: 1px solid #ccc;">
                            <td style="padding: 10px; text-align: center;">{{ album.id }}</td>
                            <td style="padding: 10px; text-align: center;">{{ album.name }}</td>
                            <td style="padding: 10px; text-align: center;">{{ album.user_id }}</td>
                            <td style="padding: 10px; text-align: center;">
                                <button @click="removeAlbum(album)" style="padding: 5px 10px; background-color: #dc3545; color: #fff; border: none; cursor: pointer;">Remove</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="stats-display">
                <h2 style="color: #333; text-align: center;">Stats Display</h2>
                <div>
                    <h3 style="color: #333; text-align: center;">Top Three Songs Based on Ratings</h3>
                    <table class="top-songs-table" style="width: 100%; border-collapse: collapse; background-color: #fff;">
                        <thead>
                            <tr style="border-bottom: 1px solid #ccc;">
                                <th style="padding: 10px; text-align: center;">#</th>
                                <th style="padding: 10px; text-align: center;">Title</th>
                                <th style="padding: 10px; text-align: center;">Artist</th>
                                <th style="padding: 10px; text-align: center;">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(song, index) in topThreeSongs" :key="song.id" style="border-bottom: 1px solid #ccc;">
                                <td style="padding: 10px; text-align: center;">{{ index + 1 }}</td>
                                <td style="padding: 10px; text-align: center;">{{ song.title }}</td>
                                <td style="padding: 10px; text-align: center;">{{ song.artist }}</td>
                                <td style="padding: 10px; text-align: center;">{{ song.rating.toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,
    components: {
        navbaradmin
    }
};
