const express = require('express')
const leaderRouter = express.Router()
const Leaders = require('../models/leaders')
const auth = require('../middlewares/auth')

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then(leaders => {
                res.status(200).json(leaders)
            })
            .catch(next)
        
    })
    .all(auth.jwtAuthenticate, auth.verifyAdmin)
    .post((req, res, next) => {
        const newLeader = req.body
        Leaders.create(newLeader)
            .then(doc => {
                res.status(200).json(doc)
            }, next)
    })
    .put((req, res, next) => {
        throw new Error('PUT not supported')
    })
    .delete((req, res, next) => {
        Leaders.deleteMany({})
            .then(result => res.status(200).send(result))
            .catch(next)
    })

leaderRouter.route('/:leaderId')
    

    
    .all((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then(leader => {
                req.leader = leader
                next()
            }, next)
        
    })
    .get((req, res, next) => {
        res.json(req.leader)
    })
    .all(auth.jwtAuthenticate, auth.verifyAdmin)
    .post((req, res, next) => {
        throw new Error('POST not supported')
    })
    .put((req, res, next) => {
        Leaders.findOneAndUpdate({_id: req.params.leaderId}, req.body, {new: true})
            .then(leader => res.status(200).json(leader), next)
    })
    .delete((req, res, next) => {
        Leaders.deleteOne({_id: req.params.leaderId})
            .then(result => res.status(200).json(result))
    })


module.exports = leaderRouter