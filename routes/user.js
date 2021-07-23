const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');
//const mongoMask = require('mongo-mask'); use mysql package to mask personal data

/* create a user account */
router.post('/signup', userController.createUser);

/* authentify a user */
router.post('/login', userController.authentifyUser);

/* delete a user account */
router.delete('/users/:id', auth, userController.deleteUser);

/* get all users -- masked data security */
router.get('/users', auth, userController.getAllUsers)

/* get one user -- masked data security */
router.get('/users/:id', auth,userController.getUser)

module.exports = router;