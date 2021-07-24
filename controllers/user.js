const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const pwRules = require('../security/password');
const inputValidator = require('node-input-validator');
const user = require('../models/user');


/* input validation, hash received PW, create new user with hashed PW */
exports.createUser = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        firstname: 'required|string|length:50',
        lastname: 'required|string|length:50',
        email: 'required|email|length:100',
        password: 'required'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            if (pwRules.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = User.create({
                        prenom: req.body.prenom,
                        nom: req.body.nom,
                        password: hash,
                        isAdmin: 0
                    })
                    .then(() => res.status(201).json({ message: 'User account created !' }))
                    .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
            } else {
                throw 'Invalid password';
            }
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* input validation, search existing user, compare send PW with saved PW, return user details for legit use */
exports.authentifyUser = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        firstname: 'required|string|length:50',
        lastname: 'required|string|length:50',
        email: 'required|email|length:100',
        password: 'required'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            User.findOne({ 
                where: { email: req.body.email }
            })
            .then( user => {
                if (!user) {
                    const f = resolve => setTimeout(resolve, 5000);
                    Promise.all(f); // limit brute force attack adding a delay
                    return res.status(401).json({ error: "Didn't find user or password is invalid !"}); 
                }
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        const f = resolve => setTimeout(resolve, 5000);
                        Promise.all(f); // limit brute force attack adding a delay
                        return res.status(401).json({ error: "Didn't find user or password is invalid !"});
                    }
                    res.status(200).json({ 
                        user_id: user.id,
                        token: jwt.sign({ 
                            userId: user.id,
                            isAdmin: user.isAdmin
                        },
                        'RANDOM_TOKEN_SECRET',
                        { 
                            expiresIn: '24h' 
                        })
                    });
                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* search existing user, check user is the account owner, delete account */  
exports.deleteUser = (req, res, next) => {
    User.findOne({ 
        where: { id: req.params.id }
    })
    .then( user => {
        if (!user) {
            return res.status(401).json({ error: "Didn't find user !"}); 
        } else if ( user.id == res.locals.userId ) {
            User.destroy({ 
                where: { id: req.params.id }
            })
            .then(() => res.status(200).json({ message: 'User account deleted !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};

/* mask the email when querying the users */
exports.getAllUsers = (req, res, next) => {
    User.scope(withoutEmail).find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(404).json({ error }));
};

/* mask the email when querying the user */
exports.getUser = (req, res, next) => {
    User.scope(withoutEmail).findOne({ 
        where: { id: req.params.id }
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

/* if user is legit return the profile */
exports.getProfile = (req, res, next) => {
    if(req.body.params.id == res.locals.userId) {
        User.findOne({ 
            where: { id: req.params.id }
        })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
    } else {
        return res.status(401).json({ error: "Acces denied!" });
    }
};
