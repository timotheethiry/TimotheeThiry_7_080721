// const Sauce = require('../models/sauce'); need a model ?
const inputValidator = require('node-input-validator');

/* create a sauce, convert the body request from form-data JS object, set likes and users to 0 */
exports.createPost = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        title: 'required|string|length:150',
        content:'required|string|length:150' // match length with sql type text
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            /* sql query INSERT INTO posts
            const date = new Date();
            const post =  {
                userId: res.locals.userId,
                title: req.body.title,
                body: req.body.content,
                date: date 
            }; */
            res.status(201).json({ message: 'New sauce created !' });
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a sauce, search the corresponding image and delete it */
exports.deletePost = (req, res, next) => {

    /* sql query DROP
    if ( post.userId == res.locals.userId ) {
     */
};

/* returns a specific sauce for GET requests */
exports.getOnePost = (req, res, next) => {
    
    /* sql query SELECT FROM posts
    WHERE id */
};

/* returns all sauces for GET requests */
exports.getAllPosts = (req, res, next) => {
    
    /* sql query SELECT * FROM posts */
};