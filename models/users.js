const mongoose = require('mongoose')
const pp_local_mongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    admin: { type: Boolean, default: false }
})

userSchema.plugin(pp_local_mongoose)
const User = mongoose.model('User', userSchema)

module.exports = User