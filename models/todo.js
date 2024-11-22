const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    name: {type: String, required: true, minLength: 4, maxLength: 50},
    description: {type: String, required: true, maxLength: 200},
    done: {type: Boolean, required: true, default: false},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Todo', TodoSchema)