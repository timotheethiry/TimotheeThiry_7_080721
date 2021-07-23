const sequelize = require('sequelize'); sequelize

const commentSchema = sequelize.Schema({
    userId: { type: String, required: true},
    postId: { type: String, required: true},
    content: { type: String, required: true},
    date: { type: Number, required: true }, // optional change type
});

// add relation to users and posts tables

module.exports = sequelize.model('Comment', commentSchema);