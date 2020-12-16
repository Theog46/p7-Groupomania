const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');

router.get('/wall', messageCtrl.getAllTheWall);
router.post('/wall', messageCtrl.newPost);
router.delete('/wall/:postId', messageCtrl.deletePost);


module.exports = router;