from datetime import datetime
from flask import Flask
from jinja2 import Template
from sqlalchemy import func
from application.models import *
from application.sec import datastore
from config import DevelopmentConfig
from application.resources import api
from application.instances import cache
from application.worker import celery_init_app
import flask_excel as excel
from application.tasks import daily_reminder 
from celery.schedules import crontab
from flask_mail import  Mail, Message
from flask_security import Security, UserMixin, RoleMixin



def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    excel.init_excel(app)
    with app.app_context():
        import application.views
    return app


app = create_app()
mail = Mail(app)


celery_app = celery_init_app(app)

@celery_app.task()
def visit_reminder():
    users_to_remind= User.query.all()
    for user in users_to_remind:
        send_reminder(user)
    return "reminder sent successfully"


@celery_app.on_after_finalize.connect
def setup_periodic_task(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=17, minute =59), visit_reminder.s())
    sender.add_periodic_task(crontab(hour=18, minute =16), creator_monthly_activity_report.s())


def send_reminder(user):
    with mail.connect() as conn:
        msg = Message(subject = "Reminder" , recipients = [user.email], sender = "divyanshdixit0902@gmail.com") 
        msg.body = f"Hello {user.username}, \n\nhave you visited the music app today? Don't forget to visit the music app"
        conn.send(msg)


def gen_monthly_repo(user):
    songs_created = db.session.query(func.count(Song.id)).filter(Song.creator_id == user.id).scalar()
    albums_created = db.session.query(func.count(Album.id)).filter(Album.user_id == user.id).scalar()
    total_ratings_received = db.session.query(func.count(Rating.id)).join(Song).filter(Song.creator_id == user.id).scalar()
    
    # Fetching the specific songs and albums for a particular user
    user_songs = Song.query.filter_by(creator_id=user.id).all()
    user_albums = Album.query.filter_by(user_id=user.id).all()
    
    template = Template("""
    <h1>Monthly Activity Report for {{ user.email }}</h1>
    <p>Songs created: {{ songs_created }}</p>
    <p>Albums created: {{ albums_created }}</p>
    <p>Total ratings received: {{ total_ratings_received }}</p>
    <h2>Uploaded Songs</h2>
    <ul>
    {% for song in user_songs %}
        <li>{{ song.title }}</li>
    {% endfor %}
    </ul>
    <h2>Uploaded Albums</h2>
    <ul>
    {% for album in user_albums %}
        <li>{{ album.name }}</li>
    {% endfor %}
    </ul>
    """)

    report_content = template.render(user=user, songs_created=songs_created, albums_created=albums_created, total_ratings_received=total_ratings_received, user_songs=user_songs, user_albums=user_albums)

    return report_content


@celery_app.task()
def creator_monthly_activity_report():
    if datetime.now().day == 17:
        creator_role = Role.query.filter_by(name='creator').first()
        if not creator_role:
            return "Not a creator"
        
        creator_users = User.query.filter(User.roles.contains(creator_role)).all()
        
        with mail.connect() as conn:
            for user in creator_users:
                report_content = gen_monthly_repo(user)
                # send_email(user.email, 'Monthly Activity Report', report_content)
                msg = Message(subject = "Monthly Report" , recipients = [user.email], sender = "divyanshdixit0902@gmail.com", html =gen_monthly_repo(user))
                conn.send(msg)

            
        return 'SUCCESSFULY SENT'
    else:
        return 'NOT TODAY'

if __name__ == '__main__':
    app.run(debug=True)
