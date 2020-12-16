var mysql = require('mysql');
const mysqlConnection = require("../mysqlConfig");

exports.getAllTheWall = (req, res, next) => {
  const userId = req.body.userId;
  var sql = 'SELECT * FROM wall ORDER BY id DESC';   
  
  mysqlConnection.query(sql, function(err, result) {
    if (err) {
      throw err;
    } else {
      
      res.status(200).json(result);  
    }
  });
};



exports.newPost = (req, res, next) => {
  
  const title =   encodeURI(req.body.title);
  const content = encodeURI(req.body.content);
  const userId = req.body.userId;
  const imageUrl = req.body.imageUrl;

  var sqlPseudo = 'SELECT username FROM users WHERE id='+userId;  
  mysqlConnection.query(sqlPseudo, function(err, result1) {
    const username = result1[0].username;
    if (err) {
      throw err;
    } else { 
            var insertPost = "INSERT INTO wall (userId, userPseudo, title, content, urlImage) VALUES ('"+userId+"','"+username+"','"+title+"','"+content+"','"+imageUrl+"')";

            mysqlConnection.query(insertPost, function(err, result) {
              if (err) {
                throw err;
              } else {
                
                res.status(200).json({id: result.insertId});
              }
            });
          }
        })
};

exports.deletePost = (req, res, next) => {
const postId = req.params.postId;
var sql = 'DELETE FROM wall WHERE id ='+postId;

mysqlConnection.query(sql, function(err, result) {
  if (err) {
    throw err;
  } else {
    console.log(result);
    res.status(200).json(result);
  }
})
}