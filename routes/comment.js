const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

/* create a comment */
router.post('/:post_id/comments', auth, commentCtrl.createComment);

/* delete a comment */
router.delete('/:post_id/comments/:comment_id', auth, commentCtrl.deleteComment);

/* get all comments */
router.get('/:post_id/comments', auth, commentCtrl.getAllComments); 

module.exports = router;