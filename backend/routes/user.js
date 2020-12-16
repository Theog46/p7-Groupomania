const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profil/:userId', auth, userCtrl.getOneUser);
router.delete('/profil/:userId', auth, userCtrl.deleteAccount);
router.put('/profil/:userId', userCtrl.changeProfil);
router.post('/profil/:userId', userCtrl.changeBio);
router.get('/profil/:userId', userCtrl.verifyifAdmin);

module.exports = router;