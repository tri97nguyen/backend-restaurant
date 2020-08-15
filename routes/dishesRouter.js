const express = require('express')
const dishRouter = express.Router()



var Dishes = require('../models/dishes')


// route for /dishes
dishRouter.route('/')
.get((req, res, next) => {
    
    Dishes.find({})
        .then(docs => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(docs)
        })
        .catch(err => console.error(err))
    
})
.post((req, res, next) => {
    const newDish = req.body
    Dishes.create(newDish)
        .then(dish => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(dish)
        })
        .catch(err => console.error(err))
    
})
.put((req, res, next) => {
    res.send('/dishes do not support PUT')
})
.delete((req, res, next) => {
    Dishes.deleteMany({})
        .then(result => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(result)
        })
        .catch(err => console.error(err))
})

// route for /dishes/:dishId

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.find({_id: req.params.dishId})
        .then(doc => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(doc)
        })
        .catch(err => console.error(err))
})
.post((req, res, next) => {
    res.send(`/dishes/:dishId not support POST`)
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, {new: true})
        .then(doc => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(doc)
        })
        .catch(err => console.error(err))
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
        .then(result => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send(result)

        })
    
})




module.exports = dishRouter