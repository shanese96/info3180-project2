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

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:project2@localhost:5432/project2"
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