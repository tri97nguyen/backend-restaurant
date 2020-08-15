const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency

const commentSchema = Schema({
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    author: {type: String, requried: true}
}, {
    timestamps: true
})

const dishSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },label: {
        type: String,
        default: ''
    },price: {
        type: Currency,
        required: true,
        min: 0
    },featured: {
        type: Boolean,
        default: false
    },description: {
        type: String,
        required: true
    },
    comments: [commentSchema]

    
}, {
    timestamps: true
})

const Dishes = mongoose.model('Dish', dishSchema)

module.exports = Dishes
