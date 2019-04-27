Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <a class="navbar-brand" href="#">
                <img id="logo" src="https://image.flaticon.com/icons/svg/133/133967.svg" alt="">Photogram</a>
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
                    <router-link to="/users/<user_id>" class="nav-link">My Profile</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/logout" class="nav-link">Logout</router-link>
                  </li> 
                </ul>
              </div>
          </nav>
        </header>    
    `,
});


// Home Page
const Home = Vue.component('home', {
      template:`
      <div class="row">
        <img class="col-sm-6" id="hpic" src="https://thumbs.dreamstime.com/b/mediterranean-sea-under-pier-colorful-image-picture-was-taken-near-antalya-turkey-137431463.jpg">
        
        <div class="container col-sm-6" id="hcontainer">
          <div id="hheader">
            <h3>Photogram</h3>
          </div>
          <div id="htext">
              <p>{{ welcome }}</p>
          </div>
          <div class="row" id="hbut">
              <div class="col-sm-6">
                  <router-link to="/register">
                    <button class="btn btn-block btn-primary">Register</button>
                  </router-link>
              </div>
              <div class="col-sm-6">
                  <router-link to="/login">
                    <button class="btn btn-block btn-success">Login</button>
                  </router-link>
              </div>
          </div>
        </div>

      </div>
      `,
      data: function(){
            return {
              welcome: 'Share photos of your favourite moments with friends, family and the world.'
            }
        }
});
          

// Registration
const Register = Vue.component('register', {
    template:`
        <div class="container">
            <h3>Register</h3>
            <form class="form-horizontal" id="regForm" @submit.prevent="register" method="POST" enctype="multipart/form-data">
                
                <div class="form-group">
                    <label for="name" class="col-sm-3 control-label">Username</label>
                    <div class="col-sm-9">
                        <input id="username" type="text" class='form-control' id="name" name="username" />
                    </div>
                </div>
  
                <div class='form-group'>
                    <label for="name" class='col-sm-3 control-label'>Password</label>
                    <div class='col-sm-9'>
                        <input id="password" type="password" class='form-control' id="password" name="password" />
                    </div>
                </div>
  
                <div class='form-group'>
                    <label for="fname" class='col-sm-3 control-label'>Firstname</label>
                    <div class='col-sm-9'>
                        <input id="firstname" type="text" class='form-control' id="fname" name="firstname" />
                    </div>
                </div>
  
                <div class='form-group'>
                    <label for="lname" class='col-sm-3 control-label'>Lastname</label>
                    <div class='col-sm-9'>
                        <input id="lastname" type="text" class='form-control' id="lname" name="lastname" />
                    </div>
                </div>
      
                <div class='form-group'>
                    <label for="email" class='col-sm-3 control-label'>E-mail</label>
                    <div class='col-sm-9'>
                        <input id="email" type="email" class='form-control' id="email" name="email" />
                    </div>
                </div>
          
                <div class='form-group'>
                    <label for="subject" class='col-sm-3 control-label'>Location</label>
                    <div class='col-sm-9'>
                        <input id="location" type="text" class='form-control' id="location" name="location" />
                    </div>
                </div>
          
                <div class='form-group'>
                    <label for="name" class='col-sm-3 control-label'>Biography</label>
                    <div class='col-sm-9'>
                        <input id="bio" type="textarea" class='form-control' name="biography"/>
                    </div>
                </div>
          
               <div class='form-group'>
                  <label for="name" class='col-sm-3 control-label'>Photo</label>
                  <div class='col-sm-9'>
                      <label id='photobut' style="padding: 10px; padding-left:25px; padding-right:25px; background: white; display: table; border: solid 1px #b8bec6; border-radius:15px">
                        Browse...
                        <input id="photo" type="file" size="60" name="profile_photo" style="display: none;"/>
                      </label>               
                  </div>
              </div>
          
              <button type="submit" class="btn btn-block btn-success">Register</button>
            </form>
        </div>
    `,
    data: function(){
        return {
            errorFlag: false,
            messageFlag: false,
            errorss: [],
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

                if (jsonResponse.hasOwnProperty("errors")){
                    self.errorFlag=true;
                    self.errorss = jsonResponse.errors;
                }
                else if(jsonResponse.hasOwnProperty("message")){
                    self.errorFlag = false;
                    self.response = jsonResponse.message;
                    
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
              <h3>Login</h3>
              <form class="form-horizontal" id="loginForm" @submit.prevent="login" method="POST" enctype="multipart/form-data">
          
                  <div class="form-group">
                      <label for="name" class="col-sm-3 control-label">Username</label>
                      <div class="col-sm-9">
                          <input type="text" class='form-control' id="name" name="username" />
                      </div>
                  </div>
          
                  <div class='form-group'>
                      <label for="name" class='col-sm-3 control-label'>Password</label>
                      <div class='col-sm-9'>
                          <input type="password" class='form-control' id="password" name="password" />
                      </div>
                  </div>
                  
                  <button type="submit" class="btn btn-block btn-success">Login</button>
              </form>
          </div>
      `,
      data: function(){
        return {
            errorFlag: false,
            messageFlag: false,
            errorss: [],
            response:[],
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
  
                  if (jsonResponse.hasOwnProperty("errors")){
                      self.errorFlag=true;
                      self.errorss = jsonResponse.errors;
                  }
                  else if(jsonResponse.hasOwnProperty("message")){
                      self.errorFlag = false;
                      self.response = jsonResponse.message;
                      
                  }
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
        let self = this;
    
        fetch('api/auth/logout', {
          method: 'GET',
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          localStorage.removeItem("current_user");
          router.go();
          router.push("/");
        })
        .catch(function(error){
          console.log(error);
        });
      }
});


// Explore Page
const Explore = Vue.component('explore', {
      template:`
          
      `,
      created: function(){
        let self = this;
        
        fetch('/api/posts', {
          method: 'GET',
          headers: {
                  'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
                  'X-CSRFToken': token,
                  'Content-Type': 'application/json'
              },
              credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            self.posts = data.posts;
        })
        .catch(function(error){
          console.log(error);
        });
      },
      data: function(){
        return{
          posts: []
        }
      },
      methods:{
        likes: function(event){
          let self = this;
          
          fetch('/api/posts/<post_id>/like', {
            method: 'POST',
            headers:{
                  'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
                  'X-CSRFToken': token,
                  'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({"user_id": JSON.parse(localStorage.current_user).id, "post_id": post_id})
          })
          .then(function(response){
            return response.json();
          })
          .then(function(jsonResponse){
          
          })
          .catch(function(error){
            console.log(error);
          });
        }
      }
});


// User Profile
const Profile = Vue.component('profile', {
      template:`
          
      `,
      
});


// New Post
const NewPost = Vue.component('newpost', {
      template:`
          <div class="container">
              <h3>New Post</h3>
              <form id="newPost" class="form-horizontal" @submit.prevent="newPost" method="POST" enctype="multipart/form-data">
          
                  <div class="form-group">
                      <label for="name" class="col-sm-3 control-label">Photo</label>
                      <div class="col-sm-9">
                          <input type="file" class='form-control' id="photo" name="photo" v-on:change="onFileSelected"/>
                      </div>
                  </div>
          
                  <div class='form-group'>
                      <label for="name" class='col-sm-3 control-label'>Caption</label>
                      <div class='col-sm-9'>
                          <input type="textarea" class='form-control' id="caption" name="caption" placeholder="Write a caption..." />
                      </div>
                  </div>
                  
                  <button type="submit" class="btn btn-block btn-success">Submit</button>
              </form>
          </div>
      `,
      data: function(){
        return {
            errorFlag: false,
            messageFlag: false,
            errorss: [],
            response:[],
            filename: ""
        };
      },
      methods:{
        newPost: function(){
          let self = this;
          let newPost = document.getElementById('newPost');
          let form_data = new FormData(newPost);
          
          fetch('/api/users/<user_id>/posts', {
              method: 'POST',
              body: form_data,
              headers: {
                  'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
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
  
                  if (jsonResponse.hasOwnProperty("errors")){
                      self.errorFlag=true;
                      self.errorss = jsonResponse.errors;
                  }
                  else if(jsonResponse.hasOwnProperty("message")){
                      self.errorFlag = false;
                      self.response = jsonResponse.message;
                      
                  }
          })
          .catch(function (error) {
              console.log(error);
          });
        },
        onFileSelected: function(){
            let self = this;
            self.filename = filenameArr[filenameArr.length-1];
        }   let filenameArr = $("#photo")[0].value.split("\\");
      }
});

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/register', component: Register },
        { path: '/login', component: Login },
        { path: '/logout', component: Logout},
        { path: '/explore', component: Explore },
        { path: '/users/<user_id>', name: 'users', component: Profile },
        { path: '/posts/new', component: NewPost }
    ]
});

const app = new Vue({
    el: '#app',
    router
});

