const sequelize = require('sequelize'); sequelize

const postSchema = sequelize.Schema({
    userId: { type: String, required: true},
    title: { type: String, required: true},
    content: { type: String, required: true},
    date: { type: Number, required: true }, // change type
    imageUrl: { type: String, required: true}
});

// add relation to users and comments tables

module.exports = sequelize.model('Post', postSchema);