const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const auth = require('../middleware/auth');

/* create a coment */
router.post('/', auth, commentController.createComment);

/* delete a comment */
router.delete('/:id', auth, commentController.deleteComment);

/* get all comments */
router.get('/', auth, commentController.getAllComments);

module.exports = router;