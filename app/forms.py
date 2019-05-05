from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, SubmitField, TextField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import InputRequired, DataRequired, Email

class RegistrationForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])
    firstname = TextField('firstname', validators=[InputRequired()])
    lastname = TextField('lastname', validators=[InputRequired()])
    email = StringField('email', validators=[InputRequired(), Email()])
    location = TextField('location', validators=[InputRequired()])
    biography = TextAreaField('biography', validators=[InputRequired()])
    profile_photo = FileField('profile_photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg', 'JPG'])])
    register = SubmitField("Register")
    
class LoginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])


class PostForm(FlaskForm):
    photo = FileField('photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg', 'JPG'])])
    caption = TextAreaField('caption', validators=[InputRequired()])