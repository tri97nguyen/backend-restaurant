const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaderSchema = Schema({
    "name": { type: String, required: true },
    "image": String,
    "designation": { type: String, required: true },
    "abbr": String,
    "featured": { type: Boolean, default: false },
    "description": String
}, {
    timepstamps: true
})

const Leaders = mongoose.model('Leader', leaderSchema)

module.exports = Leaders