from celery import shared_task
from .models import Song
import flask_excel as excel

from flask_mail import Mail, Message



from .models import User, Role
from jinja2 import Template

@shared_task(ignore_result=False)
def create_song_csv():
    song_data = Song.query.with_entities(Song.title, Song.creator_id).all()
    csv_output = excel.make_response_from_query_sets(song_data ,["title","creator_id"] ,"csv" )
    file_name="test1.csv"
    with open(file_name,'wb') as f:
        f.write(csv_output.data)
    return file_name


@shared_task(ignore_result=True)
def daily_reminder(message):
    users = User.query.all()
    # for user in users:
        # with mail.connect() as conn:
        #     msg = Message(subject = "KESE HO BHAI " , recipients = [user.email], sender = "divyanshdixit0902@gmail.com") 
        #     msg.body = "CHIPI CHAPA"
        #     conn.send(msg)
        
    return message


# def test_mail():
#     with mail.connect() as conn:
#         msg = Message(subject = "Testing Mail" , recipients = ["sandeepjio2018@gmail.com"], sender = "divyanshdixit0902@gmail.com") 
#         msg.body = "Hello Message"
#         conn.send(msg)