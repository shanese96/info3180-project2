from . import db
from werkzeug.security import generate_password_hash

# User Table in DB
class Users(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    
    firstname = db.Column(db.String(20))
    lastname = db.Column(db.String(20))
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    email = db.Column(db.String(120), unique=True)
    location = db.Column(db.String(40))
    biography = db.Column(db.String(255))
    profile_photo = db.Column(db.String(255))
    joined_on = db.Column(db.String(40))
    
    def __init__(self, firstname, lastname, username, password, email, location, biography, profile_photo, joined_on):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_photo = profile_photo
        self.joined_on = joined_on
    
    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def get_id(self):
        try:
            return unicode(self.id)     #python 2 support
        except NameError:
            return str(self.id)         #python 3 support
    
    def __repr__(self):
        return '<User %r>' % (self.username)


# Post Table in DB
class Posts(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(255))
    caption = db.Column(db.String(255))
    created_on = db.Column(db.String(40))
    
    def __init__(self, user_id, photo, caption, created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on


#Likes Table in DB
class Likes(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id


#Follow Table in DB
class Follows(db.Model):
    __tablename__ = 'follows'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)
    
    def __init__(self, user_id, follow_id):
        self.user_id = user_id
        self.follower_id = follow_id