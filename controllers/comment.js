const inputValidator = require('node-input-validator');

/* create a comment */
exports.createComment = (req, res, next) => {
    const validInput = new inputValidator.Validator(postObject, {
        content:'required|string|length:150' // match length with sql type
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            /* sql query INSERT INTO comments
            const date = new Date();
            const post =  {
                userId: res.locals.userId,
                postId: post.id,
                body: req.body.content,
                date: date, optionnel
            }; */
            res.status(201).json({ message: 'New comment created !' });
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a comment */
exports.deletePost = (req, res, next) => {

    /* sql query DROP
    if ( post.userId == res.locals.userId || comment.userId == res.locals.userId || isAdmin === true ) {

    }
     */
};

/* returns all comments for GET requests */
exports.getAllComents = (req, res, next) => {
    
    /* sql query SELECT * FROM comments */
};