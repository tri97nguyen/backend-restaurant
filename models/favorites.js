const mongoose = require('mongoose')
const Schema = mongoose.Schema
const favoriteSchema = Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    dishes: [{ type: mongoose.Types.ObjectId, ref: "Dish" }]
})

const Favorites = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorites