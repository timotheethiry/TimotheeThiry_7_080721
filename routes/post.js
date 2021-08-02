const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

/* create a post */
router.post('/', auth, multer, postCtrl.createPost);

/* modify a post */
router.put('/:post_id', auth, multer, postCtrl.modifyPost);

/* delete a post */
router.delete('/:post_id', auth, postCtrl.deletePost);

/* get one post */
router.get('/:post_id', auth, postCtrl.getOnePost);

/* get all posts */
router.get('/', auth, postCtrl.getAllPosts);

module.exports = router;