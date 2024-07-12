from flask_restful  import Resource , Api , marshal_with,request , abort
from flask_security import current_user,login_required
from sqlalchemy import func, desc
from .models import  *
from .parser import *
from .data_output_fields import *
from .instances import cache
api = Api(prefix = '/api')

#----------------------------------------Song Data ----------------------------------------------------------------------------------------------------------
from flask import request

class Songdata(Resource):
    @login_required
    @marshal_with(song_data_output_fields)
    @cache.cached(timeout=500 , key_prefix= 'allSongs')
    def get(self):
        print("hi")
        return Song.query.filter_by(flag=False).all()
        
    def post(self):
        title = request.get_json().get('title')
        artist = request.get_json().get('artist')
        genre = request.get_json().get('genre')
        text = request.get_json().get('text')
        
        song_data = Song(
            title=title,
            artist=artist,
            genre=genre,
            text=text,
            creator_id = current_user.id
        )
        
        db.session.add(song_data)
        db.session.commit()
        
        return {"message": "Data added to database"}



api.add_resource(Songdata,'/song_data')


#--------------------------------------------User Data -------------------------------------------------------------------------------------------------------

class Userdata(Resource):
    @marshal_with(user_data_output_fields)
    @cache.cached(timeout=10)
    def get(self):
        return User.query.all()
    
    def post(self):
        args = user_parser.parse_args()
        user_data = User(**args)
        if User.query.filter_by(email=user_data.email).first() is None:
            db.session.add(user_data)
            db.session.commit()
            return {"message":"User created successfully"}
        
api.add_resource(Userdata,'/registration')

#----------------------------------------------Album Data -------------------------------------------------------------------------------------------------
class Albumdata(Resource):
    @marshal_with(album_data_output_fields)
    @cache.cached(timeout=10)
    def get(self):
        return Album.query.all()
        
    def post(self):
        args = album_parser.parse_args()
        album_data = Album(**args)
        db.session.add(album_data)
        db.session.commit()
        return{"message" : "Data added to database"}
        
api.add_resource(Albumdata,'/album_data')


class CreatorAlbum(Resource):
    @marshal_with(album_data_output_fields)
    def get(self):
        return Album.query.filter_by(user_id=current_user.id).all()

api.add_resource(CreatorAlbum ,'/creator_album_data')


#----------------------------------------Album Upload-----------------------------------------
class AddAlbum(Resource):
    
    def post(self):
        args = album_parser.parse_args()

        album_name = request.get_json().get('name')
        user_id = request.get_json().get('user_id')
        exist = Album.query.filter_by(name=album_name).first()
        existing_album = Album.query.filter_by(user_id=user_id, name=album_name).first()
        
        if exist or existing_album:
            return {"message": "Album already exists"}, 400  # Return a 400 Bad Request status code
    
        album = Album(**args)
        db.session.add(album)
        db.session.commit()
        return {"message": "Album has been created and added to your profile"}, 201
api.add_resource(AddAlbum,'/user/album')



#----------------------------Album -SongS-----------------------------------------------------------------------------------------------------------
class AlbumSongs(Resource):
    def get(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return {'error': 'Album not found'}, 404

        songs = album.songs
        
        if not songs:
            return {'error': 'No songs found for the album'}, 404

        # Convert songs to a list of dictionaries for JSON serialization
        songs_data = [{'id': song.id, 'title': song.title} for song in songs]
        return songs_data
api.add_resource(AlbumSongs,'/album/<int:album_id>/songs')

#-------------------------- Add Playlist ---------------------------------------------------------------------------------------------------------

class AddPlaylist(Resource):
    
    def post(self):
        args = playlist_parser.parse_args()

        playlist_name = request.get_json().get('name')
        user_id = request.get_json().get('user_id')
        existing_playlist = Playlist.query.filter_by(user_id=user_id, name=playlist_name).first()
        
        if existing_playlist:
            return {"message": "Playlist already exists"}, 400  # Return a 400 Bad Request status code
        
        playlist = Playlist(**args)
        db.session.add(playlist)
        db.session.commit()
        return {"message": "Playlist has been created and added to your profile"}, 201
api.add_resource(AddPlaylist,'/user/playlist')
#---------------------Playlist----------------------------------------------------------------------------------------------
class  UserPlaylists(Resource):
    @login_required
    @marshal_with(playlist_data_output_fields)
    def get(self):
        if current_user.is_authenticated:
            print(current_user.id)
            user_id = current_user.id
            playlist = Playlist.query.filter_by(user_id = user_id).all()
        return playlist
api.add_resource(UserPlaylists,'/playlist')

class DeletePlaylist(Resource):
    @login_required
    def delete(self,id):
            playlist = Playlist.query.get(id)
            db.session.delete(playlist)
            db.session.commit()
            return{'message': 'Successfully deleted the playlist'}
api.add_resource(DeletePlaylist,'/delete/playlist/<int:id>')


class UpdatePlaylist(Resource):
    @login_required
    def put(self, id):
        try:
            args = playlist_parser.parse_args()
            new_name = request.get_json().get('name')
            if current_user.is_authenticated:
                user_id = current_user.id
            # Query the playlist to update
                playlist = Playlist.query.filter_by(id=id, user_id=user_id).first()
            # Check if the playlist exists
            if not playlist:
                return {'error': 'Playlist not found'}, 404
            
            # Check if a playlist with the new name already exists for the user
            existing_playlist = Playlist.query.filter_by(name=new_name, user_id=user_id).first()
            if existing_playlist and existing_playlist.id != playlist.id:
                return {'message': 'Playlist already exists with this name'}, 400
            
            # Update the playlist name
            playlist.name = new_name
            playlist.user_id = user_id
            
            # Commit the changes to the database
            db.session.commit()
            
            return {'message': 'The playlist has been updated'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(UpdatePlaylist, '/edit/playlist/<int:id>')


class AddSongToPlaylist(Resource):
    @login_required
    def post(self):
        try:
            data = request.get_json()
            song_id = data.get('song_id')  # Assuming the key is 'songId' in the JSON data
            playlist_id = data.get('playlist_id')
            user_id = current_user.id
            
            # Query the playlist of the current user
            playlist = Playlist.query.filter_by(user_id=user_id , id = playlist_id).first()
            if not playlist:
                return {'error': 'Playlist not found for the current user'}, 404
            
            # Check if the song already exists in the playlist
            if any(song.id == song_id for song in playlist.songs):
                return {'message': 'Song already exists in the playlist'}, 400
            
            # Add the song to the playlist
            song = Song.query.get(song_id)
            if not song:
                return {'error': 'Song not found'}, 404
            
            playlist.songs.append(song)
            db.session.commit()
            
            return {'message': 'Song added to playlist successfully'}, 201
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(AddSongToPlaylist, "/add-song-to-playlist")


class Playlistsongs(Resource):
    def get(self, playlist_id):
        playlist = Playlist.query.get(playlist_id)
        if not playlist:
            return {'error': 'Album not found'}, 404

        # Access the songs associated with the album directly through the relationship
        songs = playlist.songs
        
        if not songs:
            return {'error': 'No songs found for the album'}, 404

        # Convert songs to a list of dictionaries for JSON serialization
        songs_data = [{'id': song.id, 'title': song.title} for song in songs]
        return songs_data
api.add_resource(Playlistsongs,'/playlist/<int:playlist_id>/songs')

class Removesong(Resource):
    @login_required
    def delete(self,id,song_id):
            playlist = Playlist.query.get(id)
            songs = playlist.songs
            for s in songs:
                if  s.id == song_id:
                     songs.remove(s)
                     db.session.commit()
                     return {"message":"Successfully deleted song from your playlist"}
api.add_resource(Removesong,'/delete/playlist/<int:id>/song/<int:song_id>')


#-----------------------------------------Rating Song -----------------------------------------------------------------------------------------------

class RatingResource(Resource):
    @marshal_with(rating_fields)
    def get(self, song_id):
        song = Song.query.filter_by(id=song_id).first()
        if song is None:
            abort(404, message='Song not found')

        avg_rating = db.session.query(func.avg(Rating.value)).filter_by(song_id=song_id).scalar() or 0
        return {'id': song_id, 'value': round(avg_rating,2) , 'user_id' :current_user.id}


    @marshal_with(rating_fields)
    @login_required
    def post(self, song_id):
        args = rating_parser.parse_args()
        value = args['value']

        if not (0 <= value <= 5):
            abort(400, message='Invalid rating value')

        song = Song.query.filter_by(id=song_id).first()
        if song is None:
            abort(404, message='Song not found')

        existing_rating = Rating.query.filter_by(song_id=song_id, user_id=current_user.id).first()
        if existing_rating:
            abort(400, message='User has already rated this song')

        rating = Rating(value=value, user_id=current_user.id, song_id=song_id)
        db.session.add(rating)
        db.session.commit()

        return rating, 201
    # ...
    @marshal_with(rating_fields)
    @login_required
    def put(self, song_id):
        args = rating_parser.parse_args()
        value = args['value']

        if not (0 <= value <= 5):
            abort(400, message='Invalid rating value')

        song = Song.query.filter_by(id=song_id).first()
        if song is None:
            abort(404, message='Song not found')

        rating = Rating.query.filter_by(song_id=song_id, user_id=current_user.id).first()
        if rating:
            rating.value = value
        else:
            rating = Rating(value=value, user_id=current_user.id, song_id=song_id)
            db.session.add(rating)

        db.session.commit()
        cumulative_rating = db.session.query(func.sum(Rating.value)).filter_by(song_id=song_id).scalar() or 0

        return {'id': song_id, 'value': round(cumulative_rating,2), 'user_id': current_user.id}

api.add_resource(RatingResource, '/songs/<int:song_id>/ratings')

class UpdateUserRole(Resource):
    @login_required
    def put(self):
        user_id = current_user.id
        user = User.query.get(user_id)
        if user is None:
            return {'message': 'User not found'}, 404
        new_role = Role.query.filter_by(name='creator').first()
        if new_role is None:
            return {'message': 'Role "creator" not found'}, 404
        user.roles = [new_role]
        db.session.commit()
        return {'message': 'User role updated successfully'}, 200

api.add_resource(UpdateUserRole, '/user/update-role')


#-----------------------------------Update Song--------------------------------------------------------------------------
class UpdateSong(Resource):
    @login_required
    def put(self , song_id):
        user_id = current_user.id
        song = Song.query.filter_by(id = song_id ,creator_id=user_id ).first()
        data = request.get_json()
        if song is None:
            return {'message': 'Song Not found'},404
        song.text = data.get('text')
        song.title = data.get('title')
        song.artist = current_user.email
        song.genre = data.get('genre')
        db.session.commit()
        return {'message':'The Song has been modified'}
api.add_resource(UpdateSong, '/update/song/<int:song_id>')
    
#--------------------------------Delete Song---------------------------------------------------------------------------------
class DeleteSong(Resource):
    @login_required
    def delete(self, song_id):
        song = Song.query.filter_by(id=song_id).first()

        if song is None:
            return {"message": "Song not found"}, 404

        db.session.delete(song)
        db.session.commit()
        return {"message": "The song has been deleted"}

api.add_resource(DeleteSong, "/delete/song/<int:song_id>")


class Songdatab(Resource):
    @login_required
    @marshal_with(song_data_output_fields)
    def get(self,id):
        return Song.query.filter_by(id=id,flag=False).first()
api.add_resource(Songdatab,'/song_data/<int:id>')


class ParticularUserSong(Resource):
    @login_required
    @marshal_with(song_data_output_fields)
    def get(self):
        return Song.query.filter_by(creator_id=current_user.id).all()
api.add_resource(ParticularUserSong,"/particular")

class DeleteAlbum(Resource):
    @login_required
    def delete(self,id):
            album = Album.query.get(id)
            db.session.delete(album)
            db.session.commit()
            return{'message': 'Successfully deleted the album'},201
api.add_resource(DeleteAlbum,'/delete/album/<int:id>')

class UpdateAlbum(Resource):
    @login_required
    def put(self, id):
        try:
            args = album_parser.parse_args()
            new_name = request.get_json().get('name')
            if current_user.is_authenticated:
                user_id = current_user.id
            # Query the playlist to update
                album = Album.query.filter_by(id=id, user_id=user_id).first()
            # Check if the playlist exists
            if not album:
                return {'error': 'Playlist not found'}, 404
            
            # Check if a playlist with the new name already exists for the user
            existing_album = Album.query.filter_by(name=new_name, user_id=user_id).first()
            if existing_album and existing_album.id != album.id:
                return {'message': 'Album already exists with this name'}, 400
            
            # Update the playlist name
            album.name = new_name
            album.user_id = user_id
            
            # Commit the changes to the database
            db.session.commit()
            
            return {'message': 'The album has been updated'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(UpdateAlbum, '/edit/album/<int:id>')


class AddSongToAlbum(Resource):
    @login_required
    def post(self):
        try:
            data = request.get_json()
            song_id = data.get('song_id')  # Assuming the key is 'songId' in the JSON data
            album_id = data.get('album_id')
            user_id = current_user.id
            
            # Query the playlist of the current user
            album = Album.query.filter_by(user_id=user_id , id = album_id).first()
            if not album:
                return {'error': 'Album not found for the current user'}, 404
            
            # Check if the song already exists in the playlist
            if any(song.id == song_id for song in album.songs):
                return {'message': 'Song already exists in the album'}, 400
            
            # Add the song to the playlist
            song = Song.query.get(song_id)
            if not song:
                return {'error': 'Song not found'}, 404
            
            album.songs.append(song)
            db.session.commit()
            
            return {'message': 'Song added to album successfully'}, 201
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(AddSongToAlbum, "/add-song-to-album")


class Albumkesongs(Resource):
    def get(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return {'error': 'Album not found'}, 404

        # Access the songs associated with the album directly through the relationship
        songs = album.songs
        
        if not songs:
            return {'error': 'No songs found for the album'}, 404

        # Convert songs to a list of dictionaries for JSON serialization
        songs_data = [{'id': song.id, 'title': song.title} for song in songs]
        return songs_data
api.add_resource(Albumkesongs,'/album/<int:album_id>/songs')

class Removealbumsong(Resource):
    @login_required
    def delete(self,id,song_id):
            album = Album.query.get(id)
            songs = album.songs
            for s in songs:
                if  s.id == song_id:
                     songs.remove(s)
                     db.session.commit()
                     return {"message":"Successfully deleted song from your album"}
api.add_resource(Removealbumsong,'/delete/album/<int:id>/song/<int:song_id>')


class Blacklist(Resource):
    @marshal_with(user_data_output_fields)
    @login_required
    def put(self, user_id):
            user = User.query.filter_by(id=user_id).first()
            if user:
                data = request.get_json()
                user.active = bool(data.get('active'))  # Convert value to boolean
                db.session.commit()
                return { "message": "User blacklisted" }, 200
            else:
                return { "message": "User not found" }, 404

api.add_resource(Blacklist, '/blacklist/<int:user_id>')


class FlagSong(Resource):
    @login_required
    def put(self, song_id):
        is_admin = False
        for role in current_user.roles:
            if role.name == "admin":
                is_admin = True
                break
        
        if is_admin:
            song = Song.query.get(song_id)
            if song:
                data = request.get_json()
                song.flag = bool(data.get('flag'))  # Assuming 'flag' is a boolean field
                db.session.commit()
                return { "message": "Song flagged" }, 200
            else:
                return { "message": "Song not found" }, 404
        else:
            return { "message": "Unauthorized" }, 401

api.add_resource(FlagSong, '/flag/<int:song_id>')

class TopThreeSongs(Resource):
    def get(self):
        top_songs = db.session.query(Song.id, Song.title, Song.artist, func.avg(Rating.value).label('rating')) \
                             .outerjoin(Rating, Song.id == Rating.song_id) \
                             .group_by(Song.id) \
                             .order_by(desc('rating')) \
                             .limit(3) \
                             .all()
        return [{'id': song.id, 'title': song.title, 'artist': song.artist, 'rating': song.rating} for song in top_songs]

api.add_resource(TopThreeSongs, '/top_three_songs')

class Adminfetchingcreators(Resource):
    @login_required
    def get(self):
        """ Returns all creator accounts that have been blacklisted by an admin"""
        if current_user.email == "admin@email.com":
            creator_role = Role.query.filter_by(name='creator').first()
            if creator_role:
                creator_users = User.query.filter(User.roles.contains(creator_role)).all()
                users_data = [
                    {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'roles': [role.name for role in user.roles],
                        'active': user.active
                    }
                    for user in creator_users
                ]
                return users_data
            else:
                return {[{"message":"No such role."}]},  500
api.add_resource(Adminfetchingcreators, "/admin/blacklist")


class Creatorcount(Resource):
    @login_required
    def get(self):
        """ Returns all creator accounts that have been blacklisted by an admin"""
        if current_user.email == "admin@email.com":
            creator_role = Role.query.filter_by(name='creator').first()
            if creator_role:
                creator_users = User.query.filter(User.roles.contains(creator_role)).all()
                return len(creator_users)
            else:
                return {[{"message":"No such role."}]},  500
api.add_resource(Creatorcount, "/creator/count")