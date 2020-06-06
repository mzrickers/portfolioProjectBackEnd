const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const treatSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true
    }
}, {
    timestamps: true
})

const Treat = mongoose.model("Treat", treatSchema);

module.exports = Treat;