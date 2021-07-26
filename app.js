const express = require('express');
const bodyParser = require('body-parser');
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

/* connection configuration to avoid direct access to the database */
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;

/* connection to the database
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
}); 

connection.connect((err) => {
    if (err) {
        console.log("Access denied to mysql!");
        return;
    }
    console.log('Access granted to mysql!');
});*/

/* CORS issues -- check to port used by vuejs */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* parse the body request into JS object*/
app.use(bodyParser.json());

/*connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
});*/

/* use the routers for posts and authentification requests*/
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/auth', userRoutes); 

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet