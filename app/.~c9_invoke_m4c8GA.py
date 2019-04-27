import os, datetime
from app import app, db, login_manager
from flask import render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import *
from app.models import *
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash


#Photogram's Home Page
@app.route('/')
def home():
    """Render website's home page."""
    return render_template('in.html')


#Register New User
@app.route('/api/users/register', methods=['POST'])
def register():
    rform = RegistrationForm()
    if request.method == "POST" and rform.validate_on_submit():
        username = rform.username.data
        password = rform.password.data
        firstname = rform.firstname.data
        lastname = rform.lastname.data
        email = rform.email.data
        location = rform.location.data
        biography = rform.biography.data
        joined_on = format_date_joined()
        
        file = rform.photo.data
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['PROFILE_PIC_UPLOAD_FOLDER'], filename))
        
        user = User(username, password, firstname, lastname, email, location, biography, joined_on, filename)
        db.session.add(user)
        db.session.commit()
        
        result = {"message": "Profile Successfully Created"}
        return jsonify(result=result)


#User Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    lform = LoginForm()
     
    if request.method == "POST" and lform.validate_on_submit():
        username = lform.username.data
        password = lform.password.data
            
        user = Users.query.filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            remember_me = False
                
            if 'remember_me' in request.form:
                remember_me = True
            
                login_user(user, remember=remember_me)
                
                flash('Logged in successfully.', 'success')
                
                next_page = request.args.get('next')
                return redirect(next_page or url_for('home'))
            
        else:
            flash('Username or Password is incorrect.', 'danger')
        
    flash_errors(lform)
    return render_template('login.html', form=lform)


#User Logout
@app.route('/api/auth/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return render_template('index.html')


#Add New Post & View Post
@app.route('/api/users/<user_id>/posts', methods=['GET','POST'])
@login_required
def post(user_id):
    if request.method == 'GET':
        posts = Posts.query.filter_by(user_id = user_id).all()
        
        user = Users.query.filter_by(id=user_id).first()
        user_follower_count = len(Follow.query.filter_by(user_id=user.id).all())
        
        response = {"status": "ok", "post_data":{"firstname":user.first_name, "lastname": user.last_name, 
            "location": user.location, "joined_on": "Member since "+strf_time(user.joined_on, "%B %Y"), 
            "bio": user.biography, "postCount": len(posts), "followers": user_follower_count, 
            "profile_image": os.path.join(app.config['PROFILE_PIC_UPLOAD_FOLDER'],user.profile_photo), "posts":[]}}
            
        for post in posts:
            postObj = {"id":post.id, "user_id": post.user_id, "photo": os.path.join(app.config['POST_PIC_UPLOAD_FOLDER'], post.photo), 
                "caption": post.caption, "created_on": post.created_on}
                
            response["post_data"]["posts"].append(postObj)
        
        return jsonify(response)
    
    pform = PostForm()
    
    if request.method == 'POST' and pform.validate_on_submit():
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
            return jsonify(status=201, message="Post Created")
            
            
    print (pform.errors.items())
    return jsonify(status=200, errors=form_errors(pform))
    

#View Other Users' Posts (Explore Page)
@app.route('/api/posts', methods=['GET'])
@login_required
def ViewPosts():
    usersPost = Posts.query.all()
    allpost = []
    
    for post in usersPost:
        user = Users.query.filter_by(id=post.user_id).first()
        
        likeCount = len(Likes.query.filter_by(post_id=post.id).all())
        
        postObject = {"id": post.id, "user_id": post.user_id, "username": user.username, 
            "user_profile_photo": os.path.join(app.config['PROFILE_PIC_UPLOAD_FOLDER'],user.profile_photo),
            "photo": os.path.join(app.config['POST_PIC_UPLOAD_FOLDER'],post.photo), "caption": post.caption, 
            "created_on": strf_time(post.created_on, "%d %B %Y"), "likes": likeCount}
        
        posts.append(postObject)
        
    return jsonify(posts=posts)


#Follow User
@app.route('/api/users/<user_id>/follow', methods=['POST'])
@login_required
def follow(user_id):
    request_payload = request.get_json()
    user_id=request_payload['user_id']
    follower_id=request_payload['follower_id']
    
    result = Follows.query.filter_by(user_id, follower_id).first()
    
    if result!= None:
        return jsonify(status=200, message="Unable to complete operation ")
    
    follow = Follows(user_id, follower_id)
    db.session.add(follow)
    db.session.commit()
    
    return jsonify(status=201, message="Operation successful")


#Like User's Photo
@app.route('/api/posts/<post_id>/like', methods=['POST'])
@login_required
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
                return jsonify(status=200, message="already liked")
        
    NewLike = Likes(post_id=post_id, user_id=user_id)
    
    db.session.add(NewLike)
    db.session.commit()
    
    total_likes = len(Likes.query.filter_by(post_id=post_id).all())
    return jsonify({"status":201,'message': 'post liked','likes':total_likes})


#Additional Code
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text, error), 'danger')


def form_errors(form):
    errorArr = []
    
    for field, errors in form.errors.items():
        for error in errors:
            errorArr.append(error)
    return errorArr


def format_date_joined():
    now = datetime.datetime.now()
    return now.strftime("%B %Y")


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