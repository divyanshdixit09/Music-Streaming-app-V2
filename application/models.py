from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                            backref=db.backref('users', lazy='dynamic'))
    

    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50) , unique=True)
    artist = db.Column(db.String(30))
    genre = db.Column(db.String(30))
    text = db.Column(db.Text())
    creator_id = db.Column(db.String(2) , nullable=False , default = '')
    flag = db.Column(db.Boolean(), default=False)

    

class Playlist(db.Model):
    __tablename__ = "playlists"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40))
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"), nullable=False , default='')

    songs = db.relationship('Song', secondary='playlist_songs',
                            backref=db.backref('playlists',lazy='dynamic'))
    
    playlist_songs = db.Table('playlist_songs',
    db.Column('playlist_id', db.Integer(), db.ForeignKey('playlists.id'), primary_key=True),
    db.Column('song_id', db.Integer(), db.ForeignKey('song.id'),
    primary_key=True))


class Album(db.Model):
    __tablename__ = "albums"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40),unique=True)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"), nullable=False , default='')

    songs = db.relationship('Song', secondary='album_songs',
                            backref=db.backref('albums',lazy='dynamic'))

album_songs = db.Table('album_songs',
    db.Column('album_id', db.Integer(), db.ForeignKey('albums.id'), primary_key=True),
    db.Column('song_id', db.Integer(), db.ForeignKey('song.id'), primary_key=True)
    )

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float , nullable =False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"),nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey("song.id"),nullable=False)



    




    
    

    


#
