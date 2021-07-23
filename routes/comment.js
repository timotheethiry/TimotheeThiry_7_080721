const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

/* create a coment */
router.post('/', auth, commentCtrl.createComment);

/* delete a comment */
router.delete('/:id', auth, commentCtrl.deleteComment);

/* get all comments */
router.get('/', auth, commentCtrl.getAllComments);

module.exports = router;