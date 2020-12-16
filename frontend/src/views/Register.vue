<template>
  <div id="register-page">
    
    <header>
      <div id="main-icon">
      <img class="main-icon" alt="Groupomania Logo" src="../assets/icon-left-font.png">
      </div>
      <div id="title">
      <h1><a href="/#/register">Inscription</a></h1>
      <h1><a href="/#/login">Connection</a></h1>
      <h2></h2>
      </div>
    </header>
    <div id="bg">
    <h2>Remplissez le formulaire pour vous connecter</h2>
    <form @submit.prevent="Register" id="login">
      <div id="form-style">
      <div class="floating-label">
        <label for="Name">Nom complet :</label><br>
        <input id="Name" v-model="username" required placeholder=" Prénom Nom"  /><br>
      </div>
      <div class="floating-label">
        <label for="email">Adresse E-mail :</label><br>
        <input type="text" v-model="email" id="email" required placeholder=" email@mail.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" /><br>
      </div>
      <div class="floating-label">
        <label for="password">Mot de passe :</label><br>
        <input  id="password" v-model="password" required type="password" placeholder=" Mot de passe" /><br>
      </div>
      <div class="floating-label">
        <label for="passwordConfirm">Confirmer le mot de passe :</label><br>
        <input  id="passwordConfirm" v-model="passwordConfirm" type="password" required placeholder=" Confirmer le mot de passe" />
      </div>
      </div>
      <button class="login-btn" type="submit">Se connecter</button>
    </form>
    
   

    </div>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {

  name: 'Register',
    data () {
        return{
            username: null,
            email: null,
            password: null,
            passwordConfirm: null,
            
        }
    },
    methods:{
            Register : function () {
        
        if (this.username == "" || this.email == "" || this.password == ""){
          alert('Veuillez remplir tous les champs avant d\'envoyer le formulaire !')
        }else if (this.password != this.passwordConfirm){
          alert('Les deux mots de passe ne sont pas identiques !')
        }else {
        axios.post('http://localhost:3000/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          
        })
       .then(function (response) {
                    if(response.status == 201){ 
                        window.location.replace("http://localhost:8080/"); 
                        
                    }else{
                        console.log("Erreur dans l'inscription !");
                        window.alert("Problème avec l'inscription, merci de réessayer");
                        
                    }
                })
                .catch(function () {
                    
                    window.alert("La requête envoyée au serveur a mal fonctionné, merci de réessayer.");
                });
        }
        
        
      },
        
    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#register-page {
  font: bold 14px/1.4 'Open Sans', arial, sans-serif;
}
header {
  border: 1px solid black;
  display: flex;
  align-items: center;
  min-width: 600px;
  min-height: 120px;
  top: 0;
  background-color: #2e302e;
}
#title {
  display: flex;
  justify-content: flex-end;
  width: 40%;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
#title a:after {
  background: none repeat scroll 0 0 transparent;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: relative;
  background: #fff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
#title a:hover:after {
  width: 100%; 
  left: 0; 
}
#main-icon {
  display: flex;
  justify-content: flex-end;
  min-width: 40%;
}

h1 {
  font-size: 1.4em;
  margin-right: 5%;
}
a {
  text-decoration: none;
  color: #F3F3F3;
}
#bg {
  background-image: url("../assets/bg-night.jpg");
  z-index: -1;
  background-size: contain;
  top: 0;
  left: 0;
  
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
}
#login {
  margin-top: 12%;
  background-color: #F3F3F3;
}
label {
  font-size: 18px;
  color: #000;
  opacity: 0.8;
  font-weight: 400;
  display: block;
  margin-top: 2%;
}
form {
  padding: 40px 30px;
  background-color: rgb(21, 32, 43);
  display: flex;
	flex-direction: column;
	padding-bottom: 20px;
  margin-left: 30%;
  margin-right: 30%;
  box-shadow: 0px 0px 0px 2px rgba(235,235,235,1);
  border-radius: 24px;
}
input {
  font-size: 16px;
  padding: 20px 0px;
  height: 45px;
  border: none;
  border-bottom: solid 1px rgba(0, 0, 0, .1);
  background: #fff;
  min-width: 280px;
  box-sizing: border-box;
  transition: all 0.3 linear;
  color: #000;
  font-weight: 400;
}
input:focus {
  border-bottom: solid 1px #b69de6;
  outline: 0;
  box-shadow: 0 2px 6px -8px rgba(182, 157, 230, .45);
}
.floating-label label {
  top: calc(50% - 7px);
  left: 0;
  transition: all 0.3s ease;
  }
.floating-label input:not(:placeholder-shown) {
    padding: 28px 0px 12px 0px;
    transition: all 0.3s;
  }
.floating-label input:not(:placeholder-shown) + label {
    transform: translateY(-10px);
    opacity: 0.7;
  }
.login-btn {
  -webkit-appearance: none;
width: auto;
min-width: 100px;
border-radius: 24px;
text-align: center;
padding: 15px 40px;
margin-top: 5px;
background-color: #2c3e50;
color: #fff;
font-size: 14px;
margin-left: auto;
margin-right: auto;
margin-top: 10%;
font-weight: 500;
box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.13);
border: none;
-webkit-transition: all .3s ease;
transition: all .3s ease;
outline: 0;
cursor: pointer;
}
.login-btn:hover {
  transform: translateY(-3px);
  box-shadow:  0 2px 6px -1px rgba(rgb(182,157,230), .65);
}
.login-btn:active {
  transform: scale(.99);
}
@media (max-width: 897px) {
  header #title {
    font-size: 12px;
    margin-left: 15%;
  }
  header img {
    height: 60px;
  }
  #login {
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20%;
  }
}
</style>