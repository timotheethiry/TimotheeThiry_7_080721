const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
//const mongoMask = require('mongo-mask'); use mysql package to mask personal data

/* create a user account */
router.post('/signup', userCtrl.createUser);

/* authentify a user */
router.post('/login', userCtrl.authentifyUser);

/* delete a user account */
router.delete('/users/:user_id', auth, userCtrl.deleteUser);

/* get all users -- masked data */
router.get('/users', auth, userCtrl.getAllUsers);

/* get user's profile -- masked data security */
router.get('/users/:user_id', auth, userCtrl.getUser);

module.exports = router;