const Post = require('../models/post');
const fs = require('fs');
const inputValidator = require('node-input-validator');
const post = require('../models/post');

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
            const date = new Date();
            const post =  Post.create({
                users_id: res.locals.userId,
                title: postObject.title,
                content: postObject.content,
                date_issue: date,
                image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
            })
            .then(() => res.status(201).json({ message: 'New post created !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* modify a post w/ or w/o an image */
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
    { 
        ...JSON.parse(req.body.post),
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
            Post.findOne({ 
                where: { id: req.params.id }
            })
            .then(post => {
                if ( post.users_id == res.locals.userId ) {
                    Post.update({ ...sauceObject }, {
                        where: { id: req.params.id } 
                    })
                    .then(() => res.status(200).json({ message: 'Post modified !' }))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a post, search the corresponding image and delete it */
exports.deletePost = (req, res, next) => {
    Post.findOne({ 
        where: { id: req.params.id }
    })
    .then(post => {
        if ( post.user_id == res.locals.userId ) {
            const filename = post.image_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ 
                    where: { id: req.params.id } 
                })
                .then(() => res.status(200).json({ message: 'Post deleted !' }))
                .catch(error => res.status(400).json({ error }));
            }) 
        }
    })
    .catch(error => res.status(500).json({ error }));

    /* sql query DROP
    if ( post.userId == res.locals.userId || user.isAdmin === true) {

        const filename = post.image_url.split('/images/')[1];
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