const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    firstname: String,
    lastname: String,
    facebookId: String,
    admin: { type: Boolean, default: false }
})

const User = mongoose.model('User', userSchema)

module.exports = User