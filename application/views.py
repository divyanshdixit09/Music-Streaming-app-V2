from flask import current_app as app, jsonify , request, render_template ,send_file
from application.sec import datastore
from flask_security import auth_required , roles_required,login_user,logout_user,current_user
from .models import *
from werkzeug.security import generate_password_hash , check_password_hash
from .tasks import create_song_csv
from celery.result import  AsyncResult

@app.get('/')
def home():
    return render_template ("index.html")

@app.get('/admin')
@auth_required("token")
@roles_required('admin')
def admin():
    return "Hello admin"
#----------------------------------------------------Creator----------------------------------------------------------------------------------------
@app.get('/activate/listener/<int:listener_id>')
@auth_required("token")
@roles_required('admin')
def activate_listener(listener_id):
    listener = User.query.get(listener_id)
    print("hi")
    if "listener" not in listener.roles:
        return jsonify({"message":"Creator does not exist."}),404
    listener.active = True
    db.session.commit()
    return jsonify({'message':'The Creator has been Activated.'})

#--------------------------------------------------REGISTER-------------------------------------------------------------------------------------

@app.post('/register')
def register_user():
    email=request.json['email']
    password=request.json['password']
    if not datastore.find_user(email=email):
        datastore.create_user(email=email, password=generate_password_hash(password), roles=["listener"])
        db.session.commit()
        return jsonify({'message': 'Success'}),201
    else :
        return jsonify({'error':'Email already exists!'}),409
    

@app.post('/listener-login')
def login_listener():
    data = request.get_json()
    email = data.get('email')
    password = data.get("password")
    
    if not email:
        return jsonify({"message": "Email not found"}), 400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_role = user.roles[0].name if user.roles else None
    
    # Prevent users with the role 'admin' from logging in
    if user_role == 'admin':
        return jsonify({"message": "Wrong Credentials"}), 403
    if user.active==False:
        return jsonify({"message": "Account is Disabled You Breached Companies policy"}), 403
    if check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user_role, "id": user.id})
    else:
        return jsonify({"message": "Invalid credentials"}), 400
#---------------------------------ADMIN LOGIN--------------------------------------------------------------------------------------------------
@app.post('/admin-login')
def login_admin():
    data = request.get_json()
    email = data.get('email')
    password = data.get("password")
    
    if not email:
        return jsonify({"message": "Email not found"}), 400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_role = user.roles[0].name if user.roles else None
    
    # Check if the user has admin role
    if user_role != 'admin':
        return jsonify({"message": "You are not authorized to access this page"}), 403
    
    if check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user_role, "id": user.id})
    else:
        return jsonify({"message": "Invalid credentials"}), 400


#-----------------------------------LYRICS------------------------------------------------------------------------------------------------    
@app.get('/lyrics/<int:id>')
def lyrics(id):
    song = Song.query.filter_by(id=id).first()
    if not song:
        return jsonify({"message":"Song Not Found"}), 404
    return jsonify(song.text)
        
#---------------------------------Logout----------------------------------------------------------------------------------------------
@app.get('/logout')
def logout():
    logout_user(current_user)
    return jsonify({'message':'Logged out'})

#---------------Search-------------------------------------------------------------

from sqlalchemy import or_
from sqlalchemy import func

@app.route('/search/songs', methods=['GET'])


def search_songs():
    # Get the search query parameter from the request URL
    query = request.args.get('query')

    # Query the database for songs matching the query
    songs = Song.query.filter(or_(Song.title.like(f'%{query}%'), Song.artist.like(f'%{query}%'))).all()

    # Get average ratings for each song
    song_ratings = {}
    for song in songs:
        avg_rating = Rating.query.filter_by(song_id=song.id).with_entities(func.avg(Rating.value)).scalar()
        song_ratings[song.id] = avg_rating if avg_rating else 0.0

    # Serialize the songs data into a JSON response, including ratings
    song_data = [{'id': song.id, 'title': song.title, 'artist': song.artist, 'flag': song.flag, 'average_rating': song_ratings.get(song.id, 0.0)} for song in songs]

    return jsonify({'songs': song_data})




@app.route('/search/albums', methods=['GET'])
def search_albums():
    # Get the search query parameter from the request URL
    query = request.args.get('query')

    # Query the database for albums matching the query
    albums = Album.query.filter(Album.name.like(f'%{query}%')).all()

    # Serialize the albums data into a JSON response
    album_data = [{'id': album.id, 'name': album.name, 'user_id': album.user_id} for album in albums]

    return jsonify({'albums': album_data})

@app.route('/search/users', methods=['GET'])
def search_users():
    # Get the search query parameter from the request URL
    query = request.args.get('query')

    # Query the database for users with the role of "creator" matching the query
    creator_role = Role.query.filter_by(name='creator').first()
    if creator_role:
        users = User.query.filter(User.roles.contains(creator_role)).filter(User.email.like(f'%{query}%')).all()
    else:
        return jsonify({'error': 'Role "creator" not found'})

    # Serialize the users data into a JSON response
    user_data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
        for user in users
    ]

    return jsonify({'users': user_data})

@app.route('/user-count', methods=['GET'])
def user_count():
    # Count the total number of users
    total_users = User.query.count()
    return jsonify({'total_users': (total_users-1)})

@app.route('/creator-count', methods=['GET'])
def creator_count():
    # Count the total number of creators based on their roles
    creator_role = Role.query.filter_by(name='Creator').first()
    if creator_role:
        total_creators = creator_role.users.count()
    else:
        total_creators = 0
    return jsonify({'total_creators': total_creators})



@app.route('/download-csv')
def download_csv():
    task=create_song_csv.delay()
    return jsonify({'task-id':task.id})

@app.route('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message":"Task not initiated"}),404