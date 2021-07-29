const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pwRules = require('../security/password');
const inputValidator = require('node-input-validator');

/* import specific to sequelize-cli */
const db = require('../models');

/* input validation, hash received PW, create new user with hashed PW */
exports.createUser = (req, res, next) => {
    const userBody = req.body;
    const validInput = new inputValidator.Validator(userBody, {
        prenom: 'required|string|length:50',
        nom: 'required|string|length:50',
        email: 'required|email|length:100',
        password: 'required'
      }); 

    validInput.check()
    .then((matched) => {
        if (!matched) {
            console.log("input invalid");
            res.status(400).send(validInput.errors);
        } else {
            if (pwRules.validate(userBody.password)) {
                bcrypt.hash(userBody.password, 10)
                .then(hash => {
                    db.User.create({
                        email: userBody.email,
                        prenom: userBody.prenom,
                        nom: userBody.nom,
                        password: hash,
                        isAdmin: 0
                    })
                    .then(user => res.status(200).json({ message: "User created!", userId: user.id }))
                    .catch(error => res.status(400).json(error)); // change error in case email already exist it returns the isntance
                })
                .catch(error => res.status(500).json({ error }));
            } else {
                return res.status(400).json({ error: 'Invalid password' }); 
            }
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* input validation, search existing user, compare send PW with saved PW, return user details for legit use */
exports.authentifyUser = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        email: 'required|email|length:100',
        password: 'required'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            db.User.findOne({ 
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
    db.User.findOne({ 
        where: { id: req.params.user_id }
    })
    .then( user => {
        if (!user) {
            return res.status(401).json({ error: "Didn't find user !"}); 
        }
        if ( user.id == res.locals.userId ) {
            db.User.destroy({ 
                where: { id: req.params.user_id }
            })
            .then(() => res.status(200).json({ message: 'User account deleted !' }))
            .catch(error => res.status(400).json({ error }));
        } else {
            return res.status(401).json({ error: "Access denied!" });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

/* mask the email when querying the users */
exports.getAllUsers = (req, res, next) => {
    db.User.findAll()
    .then(users => {
        users.forEach(users => {
            users.prenom = "xxxx";
            users.nom = "xxxx";
            users.email = "xxxx.xxx@gmail.com";
            users.password = "Secret";
        });
        res.status(200).json(users);
    })
    .catch(error => res.status(404).json({ error }));
};

/* if user is legit return the profile */
exports.getUser = (req, res, next) => {
    if (req.params.user_id == res.locals.userId) {
        db.User.findOne({ 
            where: { id: req.params.user_id }
        })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
    } else {
        db.User.findOne({ 
            where: { id: req.params.user_id }
        })
        .then(user => {
            user.email = "xxxx.xxx@gmail.com";
            user.password = "Secret";
            res.status(200).json(user);
        })
        .catch(error => res.status(404).json({ error }));
    } 
};
