const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Currency not used yet, but for treats yes
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;