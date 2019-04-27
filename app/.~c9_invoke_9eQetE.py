import os, datetime
import jwt
from functools import wraps
from app import app, db, login_manager
from flask import render_template, request, jsonify, redirect, url_for, g
from flask_login import login_user, logout_user, current_user
from app.forms import *
from app.models import *
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash


#Home Page
@app.route('/')
def home():
    return app.send_static_file('index.html')
    

# #Token for access after login
def token_authenticate(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        
        auth = request.headers.get('Authorization', None)
        
        if auth is None:
           return jsonify({'message':'Token is missing'})
        
        if auth.split()[0].lower() != "x-token":
            return jsonify({'message':'Not a Token'})
            
        token  = auth.split()[1]
        print(token)
        try:
            data = jwt.decode(token,app.config['SECRET_KEY'])
            
        except jwt.DecodeError:
            return jsonify({'message':'Token is invalid'})
        except jwt.ExpiredSignature:
            return jsonify({'message':'Token is invalid'})
       
        g.current_user = data
        print(data)
        return func(*args, **kwargs)
    return decorated


#Register New User
@app.route('/api/users/register', methods=['POST'])
def register():
    rform = RegistrationForm()
    if request.method == "POST" and rform.validate_on_submit():
        try:
            username = rform.username.data
            password = rform.password.data
            firstname = rform.firstname.data
            lastname = rform.lastname.data
            email = rform.email.data
            location = rform.location.data
            biography = rform.biography.data
            joined_on = format_date_joined()
            
            file = rform.photo.data
            filename = username+secure_filename(file.filename)
            file.save(os.path.join(app.config['PROFILE_PIC_UPLOAD_FOLDER'], filename))
            
            user = Users(username, password, firstname, lastname, email, location, biography, filename, joined_on)
            db.session.add(user)
            db.session.commit()
        
            result = {"message": "User successfully registered"}
            return jsonify(result)
        
        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify(errors=["Internal Error"])
        
    return  jsonify(errors=form_errors(rform))


#User Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    lform = LoginForm()
     
    if request.method == "POST" and lform.validate_on_submit():
        username = lform.username.data
        password = lform.password.data
            
        user = Users.query.filter_by(username=username).first()
        
        if user != None and check_password_hash(user.password, password):
            payload = {'user': user.username}
            jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm="HS256")
            response = {'token': jwt_token, 'message': 'User successfully logged in.'}
            
            return jsonify(response)
        
        return jsonify(errors="Username or Password is Incorrect")
    
    return jsonify(errors=form_errors(lform))


#User Logout
@app.route('/api/auth/logout', methods=['GET'])
@token_authenticate
def logout():
    logout_user()
    response = {'message': 'User successfully logged out.'}
            
    return jsonify(response)


#Add New Post & View User Profile
@app.route('/api/users/<user_id>/posts', methods=['GET','POST'])
@token_authenticate
def posts(user_id):
    if request.method == 'GET':
        posts = Posts.query.filter_by(user_id = user_id).all()
        
        user = Users.query.filter_by(id=user_id).first()
        follower_count = len(Follows.query.filter_by(user_id=user.id).all())
        
        response = {
            "status": "ok", 
            "post_data":{
                "firstname":user.first_name, 
                "lastname": user.last_name, 
                "location": user.location, 
                "joined_on": "Member since: "+strf_time(user.joined_on, "%B %Y"), 
                "bio": user.biography, 
                "postCount": len(posts), 
                "followers": follower_count, 
                "profile_image": os.path.join(app.config['PROFILE_PIC_UPLOAD_FOLDER'],user.profile_photo), 
                "posts":[]
            }
        }
            
        for post in posts:
            postObj = {
                "id":post.id, 
                "user_id": post.user_id, 
                "photo": os.path.join(app.config['POST_PIC_UPLOAD_FOLDER'], post.photo), 
                "caption": post.caption, 
                "created_on": post.created_on
            }
                
            response["post_data"]["posts"].append(postObj)
        
        return jsonify(response)
    
    #Add New Post
    if request.method == 'POST' and pform.validate_on_submit():
            pform = PostForm()
            
            user_id = pform.user_id.data
            photo = pform.user_id.data
            caption = pform.caption.data
            
            user = Users.query.filter_by(id=user_id).first()
            
            filename = user.username + secure_filename(photo.filename)
            
            date_created = str(datetime.date.today())
            post = Posts(user_id=user_id, photo=filename, caption=caption, created_on=date_created)
            photo.save(os.path.join(app.config['POST_PIC_UPLOAD_FOLDER'],filename))
            
            db.session.add(post)
            db.session.commit()
            return jsonify(status=201, message="Successfully created a new post")
            
    print (pform.errors.items())
    return jsonify(status=200, errors=form_errors(pform))
    

#View Other Users' Posts (Explore Page)
@app.route('/api/posts', methods=['GET'])
            likes
def explore():
    usersPost = Posts.query.all()
    allpost = []
    
    for post in usersPost:
        user = Users.query.filter_by(id=post.user_id).first()
        
        likeCount = len(Likes.query.filter_by(post_id=post.id).all())
        posts = {
            "id": post.id,
            "user_id": post.user_id,
            "photo": os.path.join(app.config['POST_PIC_UPLOAD_FOLDER'], post.photo),
            "caption": post.caption,
            "created_on": strf_time(post.created_on, "%d %B %Y"),
            "likes": likeCount
        }
        allpost.append(posts)
    return jsonify({'posts':allpost})


#Follow User
@app.route('/api/users/<user_id>/follow', methods=['POST'])
@token_authenticate
def follow(user_id):
    user_id = g.current_user['id']
    
    data = request.get_json()
    follower_id = data['follower_id']
    
    follow = Follows(user_id=user_id,follower_id=follower_id)
    
    db.session.add(follow)
    db.session.commit()
    
    return jsonify({'message':'You are now following that user.'})


#Like A User's Photo
@app.route('/api/posts/<post_id>/like', methods=['POST'])
@token_authenticate
def like(post_id):
    request_payload = request.get_json()
    
    user_id = request_payload["user_id"]
    post_id = request_payload["post_id"]
    
    post = Posts.query.filter_by(id=post_id).first()
    Postlikes = Likes.query.filter_by(post_id=post_id).all()
    
    if post is None:
        return jsonify(staus="", message="Post does not exist")
        
    if Postlikes is not None:
        for like in Postlikes:
            if like.user_id == user_id:
                return jsonify(status=200, message="Already liked")
        
    NewLike = Likes(post_id=post_id, user_id=user_id)
    
    db.session.add(NewLike)
    db.session.commit()
    
    total_likes = len(Likes.query.filter_by(post_id=post_id).all())
    return jsonify({"status":201,'message': 'Post liked!','likes':total_likes})


#Additional Code
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


#To format the date joined
def format_date_joined():
    now = datetime.date.today()
    return now.strftime("%B %Y")


def strf_time(date, dateFormat):
    return datetime.date(int(date.split('-')[0]),int(date.split('-')[1]),
           int(date.split('-')[2])).strftime(dateFormat)


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404
    

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")