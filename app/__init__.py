from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
csrf = CSRFProtect(app)

UPLOAD_FOLDER = './app/static/uploads'
PROFILE_PIC_UPLOAD_FOLDER = './app/static/uploads/profilepics'
POST_PIC_UPLOAD_FOLDER = './app/static/uploads/postpics'
ALLOWED_IMAGES = set(['jpg', 'png', 'JPG','jpeg'])

app.config['SECRET_KEY'] = "strawberrystarbursts"

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROFILE_PIC_UPLOAD_FOLDER'] = PROFILE_PIC_UPLOAD_FOLDER
app.config['POST_PIC_UPLOAD_FOLDER'] = POST_PIC_UPLOAD_FOLDER
app.config['ALLOWED_IMAGES'] = ALLOWED_IMAGES

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://peaqcjbobmubpq:628fde35c9d59a5e1f11a7570306b8ba7139e427563d26e6d741b8b959891646@ec2-54-197-234-117.compute-1.amazonaws.com:5432/d2hdv14rpf8a87'
#"postgresql://postgres:info3180@localhost:5432/project2"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

#Flask-Login Login Manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

app.config.from_object(__name__)

from app import db, models
from app import views