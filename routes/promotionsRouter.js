const express = require('express')
const promotionRouter = express.Router()

promotionRouter.route('/')
.get((req, res, next) => {
    res.send('Will give back promotions')
})
.post((req, res, next) => {
    res.send(`Will post new promotion with name: ${req.body.foo}
            and content ${req.body.bar}`)
})
.put((req, res, next) => {
    res.send('/promotions do not support PUT')
})
.delete((req, res, next) => {
    res.send('Will delete all promotions')
})

promotionRouter.route('/:promoId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next()
})
.get((req, res, next) => {
    res.send(`will get promotion ${req.params.promoId}`)
})
.post((req, res, next) => {
    res.send(`/promotions/:promoId not support POST`)
})
.put((req, res, next) => {
    res.send(`will update promotion ${req.params.promoId} with content ${req.body.foo} and ${req.body.bar}`)
})
.delete((req, res, next) => {
    res.send(`will delete promotion ${req.params.promoId}`)
})


module.exports = promotionRouter