from flask_restful import reqparse
from flask_security import current_user
from werkzeug.datastructures import FileStorage

song_parser =reqparse.RequestParser()
song_parser.add_argument('id', type=int, help='id missing',required=True)
song_parser.add_argument('title', type=str, help='title missing',required=True)
song_parser.add_argument('artist',type=str, help='artist missing',required=True)
song_parser.add_argument('genre',type=str, help='genre missing',required=True)
song_parser.add_argument('text',type=str, help='text missing',required=True)
song_parser.add_argument('creator_id',type=int, help='creator id missing',required=True)
# song_parser.add_argument('file', type=str, location='files', required=True, help='File Required')




user_parser = reqparse.RequestParser()
user_parser.add_argument( 'email' , type = str , help ='email missing',required= True  )
user_parser.add_argument( 'password' , type = str , help ='password missing',required= True  )

album_parser = reqparse.RequestParser()
album_parser.add_argument('name', type = str , help = 'Album name is required',required =True )
album_parser.add_argument("user_id",type=int,help="User id can not be empty",required=False)


playlist_parser = reqparse.RequestParser()
playlist_parser.add_argument("name", type=str,help="Playlist name can not be empty",required=True)
playlist_parser.add_argument("user_id",type=int,help="User id can not be empty",required=False)



rating_parser = reqparse.RequestParser()
rating_parser.add_argument('value', type=float, required=True, help='Value is required')


