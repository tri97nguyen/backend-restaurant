const express = require('express')
const dishRouter = express.Router()
const auth = require('../middlewares/auth')
const cors = require('./cors')
var Dishes = require('../models/dishes')

// route for /dishes
dishRouter.route('/')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        console.log('in dishRouter GET method')

        Dishes.find({}).populate('comments.author')
            .then(docs => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.send(docs)
            })
            .catch(err => console.error(err))
        
    })
    .all(cors.corsWithOption, auth.jwtAuthenticate, auth.verifyAdmin)
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
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({_id: req.params.dishId}).populate('comments.author')
            .then(doc => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.send(doc)
            })
            .catch(err => console.error(err))
    })
    .all(cors.corsWithOption, auth.jwtAuthenticate, auth.verifyAdmin)
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
    .options(cors.corsWithOption, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        Dishes.findById(req.params.dishId).populate('comments.author')
            .then(dish => {
                req.dish = dish
                next()
            })
            .catch(err => console.error(err))
    })
    .get(cors.cors, (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.send(req.dish.comments)
    })
    .all(cors.corsWithOption)
    .post(auth.jwtAuthenticate, (req, res) => {
        const currentUserId = req.user._id
        const newComment = req.body
        newComment.author = currentUserId
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
    .delete(auth.jwtAuthenticate, auth.verifyAdmin, (req, res) => {
        req.dish.comments = []
        req.dish.save()
            .then(removedComment => res.status(200).send(removedComment))
    })
    
// route for /dishes/:dishId/comments/:commentId

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOption, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        const cmtId = req.params.commentId
        Dishes.findById(req.params.dishId).populate('comments.author')
            .then(dish => {
                const comment = dish.comments.id(cmtId)
                req.dish = dish
                req.comment = comment
                next()
            })
    })
    .get(cors.cors, (req, res) => {
        res.status(200).send(req.comment)
    })
    .all(cors.corsWithOption, auth.jwtAuthenticate)
    .put((req, res,next) => {
        if (JSON.stringify(req.user._id) !== JSON.stringify(req.comment.author._id)) next(new Error("only author can modify content"));
        else {
            for (var key in req.body) {
                req.comment[key] = req.body[key]
            }

            req.dish.save()
                .then(dish => res.status(200).send(dish))
        }
    })
    .delete((req, res, next) => {
        if (JSON.stringify(req.user._id) !== JSON.stringify(req.comment.author._id)) next(new Error("only author can delete content"));
        else {
            req.dish.comments.pull(req.comment._id)
            req.dish.save()
                .then(dish => res.status(200).send(dish))
        }
    })
    


module.exports = dishRouter