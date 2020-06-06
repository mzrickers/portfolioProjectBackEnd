const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Decor = mongoose.model('Decor', decorSchema);

module.exports = Decor;