const Post = require('../models/post');
const fs = require('fs');
const inputValidator = require('node-input-validator');

/* create a post, convert the body request from form-data JS object */
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    const validInput = new inputValidator.Validator(postObject, {
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
                date: date,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
            }; */
            res.status(201).json({ message: 'New post created !' });
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* modify a post w/ or w/o an image */
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
    { 
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { 
        ...req.body // w/o the image the body is alreay an object JS it can't be parsed
    };
    const validInput = new inputValidator.Validator(postObject, {
        title: 'required|string|length:150',
        content:'required|string|length:150' // match length with sql type text
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            
            if ( post.userId == res.locals.userId ) {
                // query update post
            }
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a post, search the corresponding image and delete it */
exports.deletePost = (req, res, next) => {

    /* sql query DROP
    if ( post.userId == res.locals.userId || isAdmin === true) {

        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            DROP 
        }) 
    }
     */
};

/* returns a specific post for GET requests */
exports.getOnePost = (req, res, next) => {
    
    /* sql query SELECT FROM posts
    WHERE id */
};

/* returns all posts for GET requests */
exports.getAllPosts = (req, res, next) => {
    
    /* sql query SELECT * FROM posts */
};