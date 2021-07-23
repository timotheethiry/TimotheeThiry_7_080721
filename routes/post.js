const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
const auth = require('../middleware/auth');

/* create a post */
router.post('/', auth, postController.createPost);

/* delete a post */
router.delete('/:id', auth, postController.deletePost);

/* get one post */
router.get('/:id', auth, postController.getOnePost);

/* get all posts */
router.get('/', auth, postController.getAllPosts);

module.exports = router;