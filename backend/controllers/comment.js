const inputValidator = require('node-input-validator');

/* import specific to sequelize-cli */
const db = require('../models');

/* create a comment */
exports.createComment = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        content:'required|string|length:255' // match length with sql type
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            db.Post.findOne({ 
                where: { id: req.params.post_id }
            })
            .then(post => {
                db.Comment.create({
                    content: req.body.content,
                    UserId: res.locals.userId,
                    PostId: post.id
                })
                .then(comment => res.status(200).json({ message: "Comment created!", comment_id: comment.id }))
                .catch(error => res.status(400).json(error)); 
            })
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(500).send(validInput.errors));
};

/* delete a comment */
exports.deleteComment = (req, res, next) => {

    /* check if logged user is admin */
    db.User.findOne({
        where: { id: res.locals.userId}
    })
    .then( user => {
        if (user.isAdmin) {
            db.Comment.destroy({ 
                where: { id: req.params.comment_id }
            })
            .then(() => res.status(200).json({ message: 'Comment deleted !' }))
            .catch(error => res.status(400).json({ error }));
        } else {

            /* check if logged user is comment writer */
            db.Comment.findOne({ 
                where: { id: req.params.comment_id }
            })
            .then(comment => {
                if (comment.UserId == res.locals.userId) {
                    db.Comment.destroy({ 
                        where: { id: req.params.comment_id }
                    })
                    .then(() => res.status(200).json({ message: 'Comment deleted !' }))
                    .catch(error => res.status(400).json({ error }));
                } else {

                    /* check if logged user is the post writer */
                    db.Post.findOne({
                        where: { id: req.params.post_id }
                    })
                    .then(post => {
                        if (post.UserId == res.locals.userId) {
                            db.Comment.destroy({ 
                                where: { id: req.params.comment_id }
                            })
                            .then(() => res.status(200).json({ message: 'Comment deleted !' }))
                            .catch(error => res.status(400).json({ error }));
                        } else {
                            return res.status(401).json({ error: "Access denied!" });
                        }
                    })
                    .catch(error => res.status(404).json(error));   
                } 
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json(error));
};

/* get a posts' comments */
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        where: { PostId: req.params.post_id }
    })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(404).json(error));
};