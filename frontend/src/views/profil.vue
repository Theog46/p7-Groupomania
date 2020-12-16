<template>
  <div id="profil-page">
    <header>
      <div id="main-icon">
      <img class="main-icon" alt="Groupomania Logo" src="../assets/icon-left-font.png">
      </div>
      <div id="title">
      <h1><a href="/#/wall">Accueil</a></h1>
      <h1><a href="#" v-on:click="disconnect ()">Déconnexion</a></h1>
      </div>
    </header>
    <div id="bg">
      <div id="profil" v-for="membre in memberDatas" :key="membre.id">
        <h2 id="username">{{ membre.username }}</h2>
        <div id="profil-infos">
          <div class="profil" >
            <div class="profil-1">
            <form @submit.prevent="postImage">
            <div class="profil-img">
              <img class="profil-pic" :src="membre.imgUrl" alt="Image de profil">
              <input type="file" id="file" ref="file" name="avatar" @change="onFileChange">
              <button id="publish" type="submit">Modifier</button>
            </div>
            </form>
            <h3>E-mail</h3>
              <p id="email">{{ membre.email }}</p>
            <h3>Biographie</h3>
            <form @submit.prevent="postBio">
              <p id="user-bio" v-html="decodeURI(membre.bio)"></p>
            <textarea id="publish-text" type="text" placeholder="Écrivez votre biographie (150 charactères max)" maxlength="150" v-model="bio" />
            <button id="change-bio" type="submit">Changer votre bio</button>
            </form>
              </div>
              <div class="profil-2">
            
            <div class="statut">
            <h3>Statut</h3>
              <p>{{ membre.isAdmin }}</p>
            </div>
            <div class="delete-acnt">
            <h3>Supprimer mon compte</h3>
            <button id="delete-acnt" v-on:click="supprimerUser ()">Supprimer</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios').default;


export default {
  name: 'affichageProfil',
    data () {
        return{
            userId: null,
            user:"",
            memberDatas: null,
            actualPassword: null,
            newPassword: null,
            image: '',
            bio: "",
            Admin: null,
        }        
    },
    beforeMount() {
      this.affichageProfil()

      if(localStorage.role == 1)
      this.Admin = true
    },
            
    methods: {
      affichageProfil () {
        axios.get('http://localhost:3000/api/auth/profil/'+localStorage.ID,{
                    headers: {
                        authorization: localStorage.token
                        }
                })  
                .then(response =>  this.memberDatas = response.data)
                .catch(erreur => console.log(erreur));
      },
      
      onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
      return;
      this.createImage(files[0]);
    },
      createImage(file) {
      var reader = new FileReader();
      var vm = this;
      vm.image = new Image ();
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function () {
      this.image = '';
    },
      postImage () {
        axios.put('http://localhost:3000/api/auth/profil/'+localStorage.ID, {
          imageUrl: this.image,
          userId: localStorage.userId,
        })
        .then(function (response) {
          if(response.status == 200) {
            window.location.reload();
          } else {
            window.alert("Problème avec l'ajout de votre image.")
          }
        })
      },
      postBio () {
        axios.post('http://localhost:3000/api/auth/profil/'+localStorage.ID, {
          biographie: this.bio,
          userId: localStorage.userId,
        })
        .then(function (response) {
          if(response.status == 200) {
            window.location.reload();
          } else {
            window.alert("Problème avec le changement de votre bio.")
          }
        })
      },
      disconnect () {
        localStorage.clear();
        window.alert('Vous venez de vous deconnecter !');
        window.location.replace("http://localhost:8080/");
      },

      supprimerUser () {
        axios.delete('http://localhost:3000/api/auth/profil/'+localStorage.ID,{
          headers: {
            authorization: localStorage.token
          }
        })
        .then(function (response) {
          if(response.status == 200) {
            localStorage.clear();
            window.location.replace("http://localhost:8080/");
          }
        })
        .catch(erreur => console.log(erreur));
      },
      
      
    }
    }
    

</script>

<style scoped>
#profil-page {
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
#profil {
  margin-top: 11%;
  margin-left: auto;
  margin-right: auto;
  background-color: #F3F3F3;
  border-radius: 24px;
  max-width: 900px;
}
#publish-text {
  font-size: 17px;
  padding: 25px 8px;
  height: 170px;
  width: 350px;
  border: none;
  border-bottom: solid 1px rgba(0, 0, 0, .1);
  background: #fff;
  max-width: 400px;
  box-sizing: border-box;
  transition: all 0.3 linear;
  color: #000;
  font-weight: 400;
  border-radius: 4px;
  resize: none;
}
#publish-text:focus {
  border-bottom: solid 1px #b69de6;
  outline: 0;
  box-shadow: 0 2px 6px -8px rgba(182, 157, 230, .45);
}
#profil {
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
#profil button {
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
font-weight: 500;
box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.13);
border: none;
-webkit-transition: all .3s ease;
transition: all .3s ease;
outline: 0;
cursor: pointer;
}
#profil button:hover {
  transform: translateY(-3px);
  box-shadow:  0 2px 6px -1px rgba(rgb(182,157,230), .65);
}
#profil button:active {
  transform: scale(.99);
}
#btn-style {
  display: flex;
  justify-content: space-around;
  width: 500px;
  padding: 5px;
  margin-top: -2%;
}
#bg img {
  width: 30%;
  border-radius: 50%;
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
  margin-top: 5%;
  margin-bottom: 5%;
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
.profil {
  display: flex;
  min-width: 800px;
  min-height: 680px;
  
}
.profil-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.profil-1 {
  
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 15%;
  margin-top: -5%;
  min-height: 850px;
}
.profil-2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-around;
  margin-right: 8%;
  margin-top: 8%;
  max-height: 720px;
}
#user-bio {
  margin-top: 3%;
  margin-bottom: 6%;
}
.statut {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 350px;
  min-height: 250px;
}
@media (max-width: 1260px) {
  header #title {
    font-size: 12px;
    margin-right: 15%;
  }
  header img {
    height: 60px;
  }
  #profil {
    margin-top: 15%;
  }
}
@media (max-width: 1009px) {
  #profil {
    min-width: auto;
  }
}
</style>