// Header
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <router-link to="/"><img id="logo" class="logo_image" src="./static/uploads/logo.png" alt=""></router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/explore" class="nav-link">Explore</router-link>
          </li>
          <li class="nav-item active">
            <router-link v-bind:to="/users/+user_id" class="nav-link">My Profile</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/logout" class="nav-link">Logout</router-link>
          </li> 
        </ul>
      </div>
    </nav>
    `,
    watch: {
        '$route' (to, from){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.user_id=localStorage.getItem('user_id');
    },
    data: function() {
        return {
            user: [],
            user_id: null
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user=localStorage.getItem('token');
            self.user_id=localStorage.getItem('user_id');
        }
    }
});


// Home Page
const Home = Vue.component('home', {
      template:`
      <div class="row">
        <img class="col-sm-6" id="hpic" src="./static/uploads/wallpaper.jpg">
        
        <div class="container col-sm-6" id="hcontainer">
          <div id="hheader">
            <img class="logo" src="./static/uploads/logo.png"/>
          </div>
          <div id="htext">
              <p>{{ welcome }}</p>
          </div>
          <div class="row" id="hbut">
              <div class="col-sm-6">
                  <router-link to="/register">
                    <button class="btn btn-block btn-success">Register</button>
                  </router-link>
              </div>
              <div class="col-sm-6">
                  <router-link to="/login">
                    <button class="btn btn-block btn-primary">Login</button>
                  </router-link>
              </div>
          </div>
        </div>

      </div>
      `,
      data: function(){
          return {
            welcome: 'Share photos of your favourite moments with friends, family and the world.'
          };
        }
});
          

// Registration
const Register = Vue.component('register', {
    template:`
        <div class="container">
            <h3 id="heading">Register</h3>
            <div class="justify-content-center align-self-center">
              <form class="form-horizontal" id="regForm" @submit.prevent="register" action="/api/users/register" method="POST" enctype="multipart/form-data">
                  
                  <div class="form-group">
                      <label for="name" class="col-sm-3 control-label">Username</label>
                      <div class="col-auto">
                          <input id="username" type="text" class='form-control' name="username" />
                      </div>
                  </div>
    
                  <div class='form-group'>
                      <label for="name" class='col-sm-3 control-label'>Password</label>
                      <div class="col-auto">
                          <input id="password" type="password" class='form-control' name="password" />
                      </div>
                  </div>
    
                  <div class='form-group'>
                      <label for="fname" class='col-sm-3 control-label'>Firstname</label>
                      <div class="col-auto">
                          <input type="text" class='form-control' id="firstname" name="firstname" />
                      </div>
                  </div>
    
                  <div class='form-group'>
                      <label for="lname" class='col-sm-3 control-label'>Lastname</label>
                      <div class="col-auto">
                          <input type="text" class='form-control' id="lastname" name="lastname" />
                      </div>
                  </div>
        
                  <div class='form-group'>
                      <label for="email" class='col-sm-3 control-label'>E-mail</label>
                      <div class="col-auto">
                          <input type="email" class='form-control' id="email" name="email" />
                      </div>
                  </div>
            
                  <div class='form-group'>
                      <label for="subject" class='col-sm-3 control-label'>Location</label>
                      <div class="col-auto">
                          <input type="text" class='form-control' id="location" name="location" />
                      </div>
                  </div>
            
                  <div class='form-group'>
                      <label for="name" class='col-sm-3 control-label'>Biography</label>
                      <div class="col-auto">
                          <textarea rows="3"  id="biography" type="textarea" class='form-control' name="biography"/>
                      </div>
                  </div>
            
                 <div class='form-group'>
                    <label for="name" class='col-sm-3 control-label'>Photo</label>
                    <div class="col-auto">
                        <label id='photobut' style="padding: 10px; padding-left:25px; padding-right:25px; background: white; display: table; border: solid 1px #b8bec6; border-radius:15px">
                          Browse...
                          <input id="photo" type="file" size="60" name="profile_photo" style="display: none;" v-on:change = "onFileSelected"/>
                        </label>               
                    </div>
                </div>
            
                <button type="submit" class="btn btn-block btn-success">Register</button>
              </form>
            </div>
            
            <div v-if='messageFlag' style="margin-top: 5%;">
            
                <div v-if="!errorFlag ">
                    <div class="alert alert-success" >
                        {{ message }}
                    </div>
                </div>
                <div v-else >
                    <ul class="alert alert-danger">
                        <li v-for="error in message">
                            {{ error }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            errorFlag: false,
            messageFlag: false,
            error: [],
            response:[],
            filename: ""
        };
    },
    methods:{
      register: function(){
        let self = this;
        let regForm = document.getElementById('regForm');
        let form_data = new FormData(regForm);
        
        fetch('/api/users/register', {
            method: 'POST',
            body: form_data,
            headers: {
                'X-CSRFToken': token,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            // display a success message
             self.messageFlag = true;

              if(jsonResponse.message=="Required Field is missing"){
                  self.error = [jsonResponse.message];
                  self.$router.push('/register');
              }else{
                  alert(jsonResponse.message);
                  self.response = jsonResponse.response;
                  self.$router.push('/login');
              }
        })
        .catch(function (error) {
            console.log(error);
        });
      },
      onFileSelected: function(){
          let self = this;
          let filenameArr = $("#photo")[0].value.split("\\");
          self.filename = filenameArr[filenameArr.length-1];
      }
    }
});


// User Login
const Login = Vue.component('login', {
      template:`
          <div class="container">
              <h3 id="heading">Login</h3>
              <div class="justify-content-center align-items-center">
                <form method="POST" enctype="multipart/form-data" @submit.prevent="login" action="/api/auth/login" id="loginForm">
                    
                    <div class="form-group">
                        <label for="name" class="col-sm-3 control-label">Username</label>
                        <div class="col-auto">
                            <input type="text" class="form-control" id="username" name="username"/>
                        </div>
                    </div>
            
                    <div>
                        <label for="name" class="col-sm-3 control-label">Password</label>
                        <div class="col-auto">
                            <input type="password" class="form-control" id="password" name="password"/>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-block btn-success" id="loginbtn">Login</button>
                    
                </form>
              </div>
          </div>
      `,
      data: function(){
        return {
            // errorFlag: false,
            messageFlag: false,
            error: [],
            response:[],
            message:"",
            
        };
      },
      methods:{
        login: function(){
          let self = this;
          let loginForm = document.getElementById('loginForm');
          let form_data = new FormData(loginForm);
          
          fetch('/api/auth/login', {
              method: 'POST',
              body: form_data,
              headers:{
                  'X-CSRFToken': token,
                  'Content-Type': 'application/json'
              }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function (response) {
            // display a success message
             self.messageFlag = true;

              if(jsonResponse.hasOwnProperty("token")){
                current_user={"token":jsonResponse.token, id: jsonResponse.user_id};
                localStorage.current_user = JSON.stringify(current_user);
            
                router.go();
                router.push("/explore")
              }
              else{
                  self.message = jsonResponse.errors;
              }
          })
          .then(function (response) {
            let jwt_token = response.data.token;

            
            localStorage.setItem('token', jwt_token);
            console.info('Token generated and added to localStorage.');
            self.token = jwt_token;
          })
          .catch(function (error) {
              console.log(error);
          });
        }
      }
});


// User Logout
const Logout = Vue.component('logout', {
      template:`
      
      `,
      data: function(){
        return{
          response:[],
          error:[],
        };
      },
      created: function(){
          let self = this;
      
          fetch('api/auth/logout', {
            method: 'GET'
          })
          .then(function(response){
            return response.json();
          })
          .then(function(response){
            let token = response.token;
   
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', null);
            self.$router.push('/');
          })
          .catch(function(error){
            console.log(error);
          });
      }
});


// Explore Page
const Explore = Vue.component('explore', {
      template:`
          <div class="container">
              <div v-if="!login">
                  <h3>You must be logged in to view this page</h3>
                  <router-link to="/login"><button class="btn btn-primary">Login</button></router-link>
              </div>
              <div v-else>
                <ul>
                  <li v-for="post in posts">
                    <div>
                      <table>
                          <tr>
                            <td id="exlabel">
                              <img id="exprofpic" v-bind:src="'./static/uploads/profilepics'+post.profile_photo"/>
                              <h5 id="exname"><router-link v-bind:to="'/users'+post.user_id">{{post.username}}</router-link></h5>
                            </td>
                          </tr>
                          <tr>
                            <td id="expic">
                              <img v-bind:src="'./static/uploads/postpics'+post.photo"/>
                            </td>
                          </tr>
                          <tr>
                            <td id="exbody">
                              <p>{{post.caption}}</p>
                            </td>
                          </tr>
                          <tr>
                            <td id="exld">
                              <span id="exlike">
                                  <img id="exheart" v-if="post.liked" src='./static/uploads/redheart.png'/>
                                  <img id="exheart" v-else src='./static/uploads/heart.png' @click="like(post.id)"/>
                                  <h5>{{post.likeCount}}Likes</h5>
                              </span>
                              <span id="exdate">
                                <h5>{{post.created_on}}</h5>
                              </span>
                            </td>
                          </tr>
                      </table>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-if="login" class="col-sm-3" id="exbut">
                <router-link to="/post/new"><button class="btn btn-primary">New Post</button></router-link>
              </div>
          </div>
      `,
      watch:{
        'trigger' (newval,oldval){
          this.reload();
        }  
      },
      data: function() {
        return {
            reponse:[],
            error:[],
            posts:[],
            login:false,
            trigger:null
        };
      },
      created:function(){
        let self=this;
        
        fetch("/api/posts",{
            method:'GET',
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': "application/json",
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
        .then(function(response){
            return response.json();
        })
        .then(function (response){
            if(response.message == "All posts"){
                self.login = true;
                self.posts = response.posts;
                self.trigger = false;
            }else if(response.message == 'No post'){
                self.login = true;
                self.trigger = false;
            }else{
                self.login = false;
            }
        })
        .catch(function(error){
            alert(error);
            self.error = error;
        });
      },
      methods:{
        like:function(post_id){
            let self=this;
            
            fetch("/api/users/"+post_id+"/like",{
                method:'POST',
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'X-CSRFToken': localStorage.getItem('token')
                }
            })
            .then(function(response){
                return response.json();
            })
            .then(function (response){
                if(response.message == "success"){
                    fetch("/api/posts",{
                    method:'GET',
                    headers:{
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        "Content-Type": "application/json",
                        'X-CSRFToken': localStorage.getItem('token')
                    }
                     })
                    .then(function(response){
                      return response.json();
                    })
                    .then(function (response){
                      if(response.message == "All posts"){
                        self.login = true;
                        self.posts = response.posts;
                        self.trigger = false;
                      }
                      else if(response.message == 'No post'){
                        self.login = true;
                        self.trigger = false;
                      }
                      else{
                        self.login = false;
                      }
                    })
                    .catch(function(error){
                      alert(error);
                      self.error = error;
                    });
                }
            })
            .catch(function(error){
                alert(error);
                self.error = error;
            });
      }
    }
});


// User Profile
const Profile = Vue.component('profile', {
      template:`
          <div class="container">
              <div id="pcontainer">
                  <div id="pprofpic">
                        <img v-bind:src="'./static/uploads/profilepics'+user.profile_photo"/>
                  </div>
                  <div>
                      <h3>{{user.firstname}} {{user.lastname}}</h3>
                      <h5>{{user.location}}<br>Member since {{user.created_on}}</h5>
                      <h5>{{user.biography}}</h5>
                  </div>
                  <div id="pstats">
                      <p><em>{{info.posts}}</em><em>{{info.followers}}</em></p>
                      <button v-if="follow" @click="follow" class="btn btn-success">Following</button>
                      <button v-else class="btn btn-primary">Follow</button>
                  </div>
              </div>
              <div v-if="haspost">
                  <div class="row">
                      <div v-for="post in posts" class="profile col col-sm-3">
                          <img class="post" v-bind:src"'./static/uploads/postpics'+post.photo"/>
                      </div>
                  </div>
              </div>
              <div v-else>
                  <h2>There are no posts for this user</h2>
              </div>
          </div>
      `,
      watch:{
      'trigger' (newval,oldval){
          this.reload();
      }  
    },
    data: function() {
        return {
            reponse:[],
            error:[],
            posts:[],
            user:null,
            info:null,
            login:false,
            follow:false,
            haspost:true,
            trigger:null
        };
    },
    created:function(){
            let self=this;
            let user_id = this.$route.params.user_id;
            
            if (user_id == 'null'){
                self.$router.push('/explore');
            }
            
            fetch("/api/users/"+user_id+"/posts",{
                method:'GET',
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    'X-CSRFToken': localStorage.getItem('token')
                }
            })
            .then(function(response){
                return response.json();
            })
            .then(function (response){
                if(response.message == "All posts"){
                    self.login = true;
                    self.posts = response.posts;
                    self.haspost = true;
                    self.trigger = false;
                }else if(response.message == 'No post'){
                    self.login = true;
                    self.haspost = false;
                    self.trigger = false;
                }else{
                    self.login = false;
                }
            })
            .catch(function(error){
                alert(error);
                self.error = error;
            });
            
            fetch("/api/users/"+user_id,{
                method:'GET',
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    'X-CSRFToken': localStorage.getItem('token')
                }
            })
            .then(function(response){
                return response.json();
            })
            .then(function (response){
                if(response.message == "success"){
                    self.user = response.user;
                    self.info = response.info;
                    self.follow = response.info.followers;
                }
            })
            .catch(function(error){
                alert(error);
                self.error = error;
            });
        },
    methods:{
        follow:function(){
            let self=this;
            let user_id = this.$route.params.user_id;
            
            fetch("/api/users/"+user_id+"/follow",{
                method:'POST',
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json",
                    'X-CSRFToken': localStorage.getItem('token')
                }
            })
            .then(function(response){
                return response.json();
            })
            .then(function (response){
                alert(response.message);
                if(response.message == "success"){
                    self.follow = false;
                    self.info.followers = self.info.followers + 1;
                    self.$router.push('/users/'+user_id);
                }
            })
            .catch(function(error){
                alert(error);
                self.error = error;
            });
 
        }       
    }
});


// New Post
const NewPost = Vue.component('newpost', {
      template:`
          <div class="container">
              <h3 id="heading">New Post</h3>
              <div>
                <form method="POST" action="/api/users/user_id/posts" enctype="multipart/form-data" @submit.prevent="newpost" id="newpost">
                    <div class="form-group">
                        <label for="name" class="col-sm-3 control-label">Photo</label>
                        <div class="col-auto">
                            <input type="file" class="form-control-file" id="photo" name="photo" v-on:change="onFileSelected"/>
                        </div>
                    </div>
            
                    <div>
                        <label for="name" class="col-sm-3 control-label">Caption</label>
                        <div class="col-auto">
                            <textarea rows="3" type="textarea" class="form-control" id="caption" name="caption" placeholder="Write a caption..." />
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-block btn-success">Submit</button>
                </form>
              </div>
          </div>
      `,
      data: function() {
        return {
            reponse:[],
            error:[]
        };
    },
    methods:{
      newpost:function(){
        let self=this;
        let form = document.getElementById("newpost");
        let formData = new FormData(form);
        let user_id = localStorage.getItem('user_id');
        
        fetch("/api/users/"+user_id+"/posts",{
            method:'POST',
            body: formData,
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': "application/json",
              'X-CSRFToken': localStorage.getItem('token')
            }
        })
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            if(response.message == "success" ){
                self.$router.push('/explore');
            }else{
                self.error = [response.message];
                self.reponse = response.response;
                self.$router.push('/post');
            }
        })
        .catch(function(error){
            alert(error);
            self.error = error;
        });
      },
      onFileSelected: function(){
        let self = this;
        let filenameArr = $("#photo")[0].value.split("\\");
        self.filename = filenameArr[filenameArr.length-1];
      }
    }
});

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/register', component: Register },
        { path: '/login', component: Login },
        { path: '/logout', component: Logout},
        { path: '/explore', component: Explore },
        { path: '/users/:user_id', name: 'users', component: Profile },
        { path: '/posts/new', component: NewPost }
    ]
});

let app = new Vue({
    el: '#app',
    router
});