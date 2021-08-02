const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv').config();

/* import the posts and user CRUD routers */
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

/* create an express app*/
const app = express();

/* import database models */
const db = require('./models');

db.sequelize.sync().then((req) => {
    console.log("Sequelize connected to db");
});

/* CORS issues -- check to port used by vuejs */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* parse the body request into JS object*/
app.use(bodyParser.json());

/* get the images in the server to respond to the corresponding GET requests */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* use the routers for posts and authentification requests*/
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/auth', userRoutes); 

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet