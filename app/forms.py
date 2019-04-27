from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, BooleanField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import InputRequired, DataRequired, Email

class RegistrationForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])
    firstname = StringField('firstname', validators=[InputRequired()])
    lastname = StringField('lastname', validators=[InputRequired()])
    email = StringField('email', validators=[InputRequired(), Email()])
    location = StringField('location', validators=[InputRequired()])
    biography = TextAreaField('biography', validators=[InputRequired()])
    profile_photo = FileField('profile_photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg', 'JPG'])])

    
class LoginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    remember_me = BooleanField('remember me')


class PostForm(FlaskForm):
    user_id = StringField("", validators=[InputRequired()])
    photo = FileField('photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg', 'JPG'])])
    caption = TextAreaField('caption', validators=[InputRequired()])