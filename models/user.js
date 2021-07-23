const sequelize = require('sequelize');
// const uniqueValidator = require('mongoose-unique-validator'); find mysql equivalent

const userSchema = sequelize.Schema({
    userId: { type: sequelize.Types.ObjectId, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);