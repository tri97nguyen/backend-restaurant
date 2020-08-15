const express = require('express')
const leaderRouter = express.Router()

leaderRouter.route('/')
.get((req, res, next) => {
    res.send('Will give back leaders')
})
.post((req, res, next) => {
    res.send(`Will post new leader with name: ${req.body.foo}
            and content ${req.body.bar}`)
})
.put((req, res, next) => {
    res.send('/leaders do not support PUT')
})
.delete((req, res, next) => {
    res.send('Will delete all leaders')
})

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next()
})
.get((req, res, next) => {
    res.send(`will get leader ${req.params.leaderId}`)
})
.post((req, res, next) => {
    res.send(`/leaders/:leaderId not support POST`)
})
.put((req, res, next) => {
    res.send(`will update leader ${req.params.leaderId} with content ${req.body.foo} and ${req.body.bar}`)
})
.delete((req, res, next) => {
    res.send(`will delete leader ${req.params.leaderId}`)
})


module.exports = leaderRouter