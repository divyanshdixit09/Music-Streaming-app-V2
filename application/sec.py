from flask_security import SQLAlchemyUserDatastore
from application.models  import User, Role, db
datastore = SQLAlchemyUserDatastore(db,User,Role)