const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const env = require('dotenv').config();

/* connection configuration to avoid direct access to the database */
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;

/* connection to the database */
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected!');
});

connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
});