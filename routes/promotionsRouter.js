const express = require('express')
const promotionRouter = express.Router()
const Promotions = require('../models/promotions')

// routers for /promotions
promotionRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then(promos => {
                res.status(200).json(promos)
            })
            .catch(next)
        
    })
    .post((req, res, next) => {
        const newPromo = req.body
        Promotions.create(newPromo)
            .then(doc => {
                res.status(200).json(doc)
            }, next)
    })
    .put((req, res, next) => {
        throw new Error('PUT not supported')
    })
    .delete((req, res, next) => {
        Promotions.deleteMany({})
            .then(result => res.status(200).send(result))
            .catch(next)
    })
// routers for /:promoId
promotionRouter.route('/:promoId')
    .post((req, res, next) => {
        throw new Error('POST not supported')
    })
    .all((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(promo => {
                req.promo = promo
                next()
            }, next)
        
    })
    .get((req, res, next) => {
        res.json(req.promo)
    })
    .put((req, res, next) => {
        Promotions.findOneAndUpdate({_id: req.params.promoId}, req.body, {new: true})
            .then(promo => res.status(200).json(promo), next)
    })
    .delete((req, res, next) => {
        Promotions.deleteOne({_id: req.params.promoId})
            .then(result => res.status(200).json(result))
    })


module.exports = promotionRouter