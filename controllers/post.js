const fs = require('fs');
const inputValidator = require('node-input-validator');

/* import specific to sequelize-cli */
const db = require('../models');

/* create a post, convert the body request from form-data JS object */
exports.createPost = (req, res, next) => {
    const postObject = req.body;
    const validInput = new inputValidator.Validator(postObject, {
        title: 'required|string|length:150',
        content:'required|string|length:2000' // match length with sql type text
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            const date = new Date();
            db.Post.create({
                UserId: res.locals.userId,
                title: postObject.title,
                content: postObject.content,
                date_issue: date,
                image_url: null //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
            })
            .then(post => res.status(201).json({ message: 'New post created !', post_id: post.id }))
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
        content:'required|string|length:2000' // match length with sql type text
    });

    console.log(postObject);

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            db.Post.findOne({ 
                where: { id: req.params.post_id }
            })
            .then(post => {
                if ( post.UserId == res.locals.userId ) {
                    db.Post.update({ 
                        title: postObject.title,
                        content: postObject.content,
                        image_url: postObject.image_url,
                        date_issue: postObject.date_issue 
                    }, {
                        where: { id: req.params.post_id } 
                    })
                    .then(() => res.status(200).json({ message: 'Post modified !' }))
                    .catch(error => res.status(400).json({ error }));
                } else {
                    return res.status(401).json({ error: "Access denied!" });
                }
            })
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a post, search the corresponding image and delete it */
exports.deletePost = (req, res, next) => {
    
    /* check if logged user is admin */
    db.User.findOne({
        where: { id: res.locals.userId }
    })
    .then( user => {
        console.log(user.isAdmin);
        if (user.isAdmin) {
            db.Post.destroy({ 
                where: { id: req.params.post_id }
            })
            .then(() => res.status(200).json({ message: 'Post deleted !' }))
            .catch(error => res.status(400).json({ error }));

        } else {

            /* check if logged user is the post writer */
            db.Post.findOne({
                where: { id: req.params.post_id }
            })
            .then(post => {
                if (post.UserId == res.locals.userId) {
                    if (post.image_url !== null) {
                        const filename = post.image_url.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            db.Post.destroy({ 
                                where: { id: req.params.post_id } 
                            })
                            .then(() => res.status(200).json({ message: 'Post deleted !' }))
                            .catch(error => res.status(400).json({ error }));
                        })
                    } else {
                        db.Post.destroy({ 
                            where: { id: req.params.post_id } 
                        })
                        .then(() => res.status(200).json({ message: 'Post deleted !' }))
                        .catch(error => res.status(400).json({ error }));
                    } 
                } else {
                    return res.status(401).json({ error: "Access denied!" });
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json(error));
};

/* select all posts for GET requests */
exports.getOnePost = (req, res, next) => {
    db.Post.findOne({
        where: { id: req.params.post_id }
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json(error));
};

/* select a specific post for GET requests */
exports.getAllPosts = (req, res, next) => {
    db.Post.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(404).json(error));
}; 