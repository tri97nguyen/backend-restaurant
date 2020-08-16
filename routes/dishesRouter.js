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
            .catch(err => {
                console.error(err)
                res.send("Could not create dish")
            })
        
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


// route for /dishes/:dishId/comments
dishRouter.route('/:dishId/comments')
    .all((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                req.dish = dish
                next()
            })
            .catch(err => console.error(err))
    })
    .get((req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.send(req.dish.comments)
    })
    .post((req, res) => {
        const newComment = req.body
        console.log(`new comment is ${JSON.stringify(newComment)}`)
        req.dish.comments.push(newComment)
        req.dish.save()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.send(req.dish)
    })
    .put((req, res) => {
        res.statusCode = 403
        res.send('PUT not supported at this endpoint')
    })
    .delete((req, res) => {
        req.dish.comments = []
        req.dish.save()
            .then(removedComment => res.status(200).send(removedComment))
    })
    
// route for /dishes/:dishId/comments/:commentId

dishRouter.route('/:dishId/comments/:commentId')
    .all((req, res, next) => {
        const cmtId = req.params.commentId
        Dishes.findById(req.params.dishId)
            .then(dish => {
                const comment = dish.comments.id(cmtId)
                req.dish = dish
                req.comment = comment
                next()
            })
    })
    .get((req, res) => {
        res.status(200).send(req.comment)
    })
    .put((req, res) => {
        console.log(`old content is ${JSON.stringify(req.comment)}\n
                    new content is ${JSON.stringify(req.body)}    
                    `)
        
        for (var key in req.body) {
            req.comment[key] = req.body[key]
        }

        console.log(`after merge is ${JSON.stringify(req.comment)}`)
        req.dish.save()
            .then(dish => res.status(200).send(dish))
    })
    .delete((req, res) => {
        req.dish.comments.pull(req.comment._id)
        req.dish.save()
            .then(dish => res.status(200).send(dish))

    })
    


module.exports = dishRouter