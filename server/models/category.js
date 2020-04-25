const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        //unique: true,
        required: [true, 'La descripcion es necesaria']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Category', categorySchema);