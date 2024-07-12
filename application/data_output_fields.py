from flask_restful import fields

song_data_output_fields = {
    "id": fields.Integer,
    "title":fields.String,
    "artist":fields.String,
    "genre":fields.String,
    "text":fields.String,
    "creator_id":fields.Integer,
    "flag":fields.Boolean
}


user_data_output_fields = {
    "id":fields.Integer,
    "email" : fields.String ,
    "password" : fields.String,
    "active": fields.Boolean
}

album_data_output_fields = {
    "name":fields.String,
    "id":fields.Integer,
    'user_id': fields.Integer()
    }

playlist_data_output_fields = {
    'name': fields.String(),  # The description is optional
    'id': fields.Integer(),
    'user_id': fields.Integer()
}

rating_fields = {
    'id': fields.Integer,
    'value': fields.Float,
    'user_id': fields.Integer,
}