from main import app
from application.models import *
# from flask_security import hash_password
from werkzeug.security import generate_password_hash
from application.sec import datastore


with app.app_context():
    db.create_all()

    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="listener", description="User is an Listener")
    datastore.find_or_create_role(name="creator", description="User is a Creator")
    
    db.session.commit()
    
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com", password=generate_password_hash ("admin"), roles=["admin"])
    if not datastore.find_user(email="listener1@email.com"):
        datastore.create_user(email="listener1@email.com", password=generate_password_hash ("listener1"), roles=["listener"])
    if not datastore.find_user(email="creator1@email.com"):
        datastore.create_user(email="creator1@email.com", password=generate_password_hash ("creator1"), roles=["creator"],active=False)

    db.session.commit()

