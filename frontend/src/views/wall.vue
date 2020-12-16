<template>
  <div id="wall-page">
    <header>
      <div id="main-icon">
      <img class="main-icon" alt="Groupomania Logo" src="../assets/icon-left-font.png">
      </div>
      <div id="title">
      <h1><a href="/#/profil">Mon Profil</a></h1>
      <h1><a href="#" v-on:click="disconnect ()">Déconnexion</a></h1>
      </div>
    </header>
    <div id="bg">
      <div class="newPost">
        <button type="button" id="publish" v-on:click="newPost ()" v-if="formWallActif">Créer un post</button>
        <button type="button" id="publish" v-on:click="cancelPost ()" v-if="!formWallActif">Annuler le post</button>
      </div>
      <div id="wall" v-if="!formWallActif">
        <form @submit.prevent="formPostToWall">
        <h2>Quoi de neuf ?</h2>
        <div id="wall-write">
          <div>
            <div class="title">Titre : </div>
          <input type="text" class="publish-text" v-model="title" placeholder="Titre de votre post">
          </div>
          <div>
          <textarea id="publish-text" type="text" placeholder="Racontez du nouveau !" maxlength="75" v-model="content"></textarea>
          </div>

          <div v-if="!image">
                    <h4>Vous pouvez ajouter une image à votre post:</h4>
                    <input id="addImage" type="file" @change="onFileChange">
                </div>
                <div v-else>
                    <img :src="image" /><br /><br />
                    <button id="publish" @click="removeImage">Effacer l'image...</button>
          </div>

          <div id="btn-style">
            
            <button id="publish" type="submit">Publier</button>
          </div>
        </div>
        </form>
      </div>

      <div id="allPosts" v-if="formWallActif">
        <div id="wall" v-for="wallpost in wallPosts" :key="wallpost.id">
            <div class="username">Posté par : {{ wallpost.userPseudo }}</div>
            <div id="deletePost">
              <button id="delete-post" v-if="isAdmin" v-on:click="deletePost (wallpost.id)">Supprimer</button>
            </div>
            <div class="postTitle" v-html="decodeURI(wallpost.title)"></div>
            <div class="content" v-html="decodeURI(wallpost.content)"></div> 
            <div class="image" v-if="wallpost.urlImage"><img :src="wallpost.urlImage" alt="Image du mur"></div>
            
        </div>     
      </div>
      
      
    </div>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'WallComponent',
  data () {
    return {
      error: null,
      title: null,
      content: null,
      username: null,
      userId: null,
      image: '',
      imageProfil: '',
      message: null,
      wallPosts: null,
      wallpostMessages: null,
      wallreadMessages: null,
      formWallActif: true,
      isAdmin: false,
      postId: null,
    }
  },
  beforeCreate () {
    if(localStorage.ID) {
      this.userId = localStorage.ID;
      axios.get('http://localhost:3000/api/auth/profil/'+localStorage.ID, {
        headers: {
          authorization: localStorage.token
        }
      })
      .then ((reponses) => {
        console.log(reponses.data)
        if (reponses.status == 200 && reponses.data[0].isAdmin == 1) {
          console.log("Vous êtes connecté en tant qu'Administrateur");
          this.isAdmin = true;
        } else {
          console.log("Vous êtes connecté en tant que membre.");
          this.isAdmin = false;
        }
      })
      .catch (function (error) {
        console.log(error)
      })
    }
  },
  mounted () {
    if(localStorage.ID) {
      this.userId = localStorage.ID;
      axios.get('http://localhost:3000/api/message/wall')
      .then(reponse => (this.wallPosts = reponse.data)) 
      .catch(erreur => console.log(erreur)) 
    }
    
  },
    
  methods: {
    deletePost (postId) {
      
      axios.delete('http://localhost:3000/api/message/wall/'+postId , {
        headers: {
          authorization: localStorage.token
        }
      })
      .then(function (response) {
        if(response.status == 200) {
          console.log('post supprimé');
          window.location.reload();
        }
      })
      .catch(error => console.log(error))
    },
    disconnect () {
        localStorage.clear();
        window.alert('Vous venez de vous deconnecter !');
        window.location.replace("http://localhost:8080/");
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

    newPost () {
      this.formWallActif = false
    },
    cancelPost () {
      this.formWallActif = true
    },
    

    formPostToWall () {
      
      if (this.title == null || this.content == null) {
        window.alert("Merci de poster un titre et son contenu !");
      }
      axios.post('http://localhost:3000/api/message/wall', {
        title: this.title,
        content: this.content,
        imageUrl: this.image,
        username: this.username,
        userId: this.userId,
      }, {
        headers: {
          authorization: localStorage.token
        }
      })
      .then(function (response) {
        console.log(response)
        if(response.status !== 200) {
          console.log('Erreur');
          
        } else {
          window.location.reload();
        }
      })
      .catch(function () {
        console.log('Message posté avec succès.');
      }) 
      },
      beforeMount() {
        this.affichageWall () 
        
        
      }
    }
  }



</script>

<style scoped>
#wall-page {
  font: bold 14px/1.4 'Open Sans', arial, sans-serif;
}
div, p, h4 {
  color: #F3F3F3;
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
#wall-page {
  background-color: rgb(21, 32, 43);
  z-index: -1;
  background-size: contain;
  top: 0;
  left: 0;
  
  min-width: 100%;
  min-height: 100%;
  
  position: absolute;
}
#wall  {
  margin-top: 12%;
  margin-left: 30%;
  margin-right: 30%;
  margin-bottom: 2%;
  background-color: rgb(21, 32, 43);
  border: 1px solid grey;
  border-radius: 24px;
}
.newPost {
  margin-top: -4%;
}
#publish-text {
  font-size: 16px;
  padding: 20px 8px;
  height: 100px;
  width: auto;
  border: none;
  border-bottom: solid 1px rgba(0, 0, 0, .1);
  line-height: 1.3;
  min-width: 280px;
  box-sizing: border-box;
  transition: all 0.3 linear;
  overflow: hidden;
  font-weight: 400;
  border-radius: 4px;
  resize: none;
  color: #F3F3F3;
}
#publish-text:focus, input:focus {
  border: solid 1px #b69de6;
  outline: 0;
  box-shadow: 0 2px 6px -8px rgba(182, 157, 230, .45);
}
input {
  border: none;
  min-height: 30px;
}
#wall-write {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#wall-write button, #publish, #delete-post {
  -webkit-appearance: none;
width: auto;
min-width: 100px;
border-radius: 24px;
text-align: center;
padding: 15px 40px;
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
#delete-post {
  margin-top: 5px;
  margin-bottom: 12px;
}
#wall-write button:hover, #publish:hover, #delete-post:hover {
  transform: translateY(-3px);
  box-shadow:  0 2px 6px -1px rgba(rgb(182,157,230), .65);
}
#wall-write button:active, #publish:active {
  transform: scale(.99);
}
#btn-style {
  display: flex;
  justify-content: space-around;
  width: 500px;
  padding: 5px;
  margin-top: -2%;
}
textarea {
  margin-top: 5%;
}
textarea, input {
  background-color: rgb(21, 32, 43);
  color: #F3F3F3;
}
.title {
  margin-bottom: 10%;
}
.username {
  display: flex;
  justify-content: flex-start;
  padding: 8px 18px;
}
.postTitle {
  font-size: 18px;
}
.content {
  margin-top: 2%;
  margin-bottom: 2%;
}
.image {
  margin-bottom: 2%;
}
@media (max-width: 1129px) {
  #publish {
    margin-top: 15%;
    margin-left: auto;
    margin-right: auto;
  }
  
}
@media (max-width: 897px) {
  header #title {
    font-size: 12px;
    margin-left: 15%;
  }
  header img {
    height: 60px;
  }
  #publish {
    margin-top: 15%;
  }
  #wall {
    min-width: 380px;
    min-height: auto;
    margin-left: 20%;
    margin-right: 20%;
  }
  #wall img {
    max-width: 300px;
  }
}
@media (max-width: 746px) {
  header img {
    margin-right: -6%;
  }
  header #title {
    font-size: 9px;
  }
  #wall-page {
    min-height: cover;
  }
}
</style>