const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {type: String, required: true, minLength: 4, maxLength: 50},
    description: {type: String, required: true, maxLength: 200},
    completed: {type: String, required: true, default: false}
})

module.exports = mongoose.model('Todo', TodoSchema)