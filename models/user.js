const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, minLength: 4, maxLength: 30, unique: true},
    password: {type: String, required: true, minLength: 8},
});

module.exports = mongoose.model('User', UserSchema)