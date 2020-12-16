const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../mysqlConfig');
var mysql = require('mysql');
const { json } = require('body-parser');

//Inscription de l'utilisateur
exports.register = (req, res, next) => {
  const user = req.body

   bcrypt.hash(user.password, 10) 
  .then((hash) => {
      user.password = hash
      mysqlConnection.query(`INSERT INTO users SET ?`, user, (err, result) => {
          if (err) {
              console.log(err)
              return res.status(400).json("erreur")
          }
          return res.status(201).json({message : 'Votre compte a bien été crée !'})
      });
  });
};  

//Connexion de l'utilisateur
exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
if (email && password) {
    mysqlConnection.query('SELECT * FROM users WHERE email= ?', email, (error, results, fields) => {
         if (results.length > 0) {
          bcrypt.compare(password, results[0].password).then((valid) => {
            if (!valid) {
              res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
            } else {
              console.log(email, "s'est connecté")
              let status = ''
              if (results[0].isAdmin === 1) {
                status = 1
              } else {
                status = 0
              }
              res.status(200).json({
                
                userId: results[0].id,
                 username: results[0].username,
                  email: results[0].email,
                  isAdmin: results[0].isAdmin,
                  dateCreated: results[0].dateCreated,
                   token: jwt.sign( 
                    { userId: results[0].id },process.env.SECRET_CLE_TOKEN,{ expiresIn: '24h' }) 
              })
              
            }
          })
        } 
        else {
          res.status(401).json({ message: 'Non autorisé' })
        }
      }
    )
  } else {
    res.status(500).json({ message: "Entrez votre email et votre mot de passe" })
  }
}

//Obtenir les infos d'un utilisateur
exports.getOneUser = (req, res, next) => {
  const idUser = encodeURI(req.params.userId);
  var sqlAllFromMembre = 'SELECT * FROM users WHERE id ='+idUser;
  mysqlConnection.query(sqlAllFromMembre, function(err, result) {
    if (err) {
      throw err;
    } else { 
      res.status(200).json(result);  
    }
  });

}

//Supprimer un utilisateur
exports.deleteAccount = (req, res, next) => {
  const idUser = encodeURI(req.params.userId);
     
  var sql = 'DELETE FROM users WHERE id ='+idUser;   
  mysqlConnection.query(sql, function(err, result) {
    if (err) {
      throw err;
    } else {
      console.log(result)
      res.status(200).json(result);  
    }
  });
}

// Modifier image de profil
exports.changeProfil = (req, res, next) => {
  const imageUrl = encodeURI(req.body.imageUrl);
  const userId = encodeURI(req.params.userId);
  var img = "UPDATE users SET imgUrl = ('"+imageUrl+"') WHERE id="+userId;
  var sqlPseudo = 'SELECT * FROM users WHERE id='+userId;
  
  mysqlConnection.query(sqlPseudo, function(err, result) {
    if (err) {
      throw err;
    } else {
      mysqlConnection.query(img, function(err, result) {
        if (err) {
          throw err;
        } else {
          console.log(result)
          res.status(200).json(result);
        }
      })     
    }
  });
}
// Changer bio
exports.changeBio = (req, res, next) => {
  const biographie = encodeURI(req.body.biographie);
  const userId = encodeURI(req.params.userId);
  var bio = "UPDATE users SET bio = ('"+biographie+"') WHERE id="+userId;
  var sqlPseudo = 'SELECT * FROM users WHERE id='+userId;

  mysqlConnection.query(sqlPseudo, function(err, result) {
    if (err) {
      throw err;
    } else {
      mysqlConnection.query(bio, function(err, result) {
        if (err) {
          throw err;
        } else {
          console.log(result)
          res.status(200).json(result);
        }
      })
    }
  })
}

exports.verifyifAdmin = (req, res, next) => {
  const userId = res.params.userId;
  var ifAdmin = "SELECT isAdmin FROM users WHERE id="+userId;

  mysqlConnection.query(ifAdmin, function(err, result) {
    if (err) {
      throw err;
    } else {
      console.log(result)
      res.status(200).json(result);
    }
  })
}

