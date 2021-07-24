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
router.delete('/users/:id', auth, userCtrl.deleteUser);

/* get all users -- masked email */
router.get('/users', auth, userCtrl.getAllUsers);

/* get one user -- masked email */
router.get('/users/:id', auth, userCtrl.getUser);

/* get user's profile */
router.get('/users/:id/profile', auth, userCtrl.getProfile);

module.exports = router;