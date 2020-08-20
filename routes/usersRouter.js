const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const User = require('../models/users')

function registerUser(req,res,next) {
    User.register(new User({username: req.body.username}), req.body.password)
        .then(user => {
            res.status(200).json(user)
            
        }).catch(err => next(err))
    
}

userRouter.route('/')
    .get((req,res,next) => {
        User.find({})
            .then(users => res.send(users))
    })

userRouter.route('/signup')
    .post(registerUser)

userRouter.route('/login')
    .post((req, res ,next) => {
        if (req.user) next('you need to log out first');
        next()
    }, passport.authenticate('local')
    , (req, res, next) => {
        res.status(200).send('you are logged in')
    })

userRouter.route('/logout')
    .get((req, res, next) => {
        if (req.user) {
            req.session.destroy()
            res.clearCookie("lalaland")
            res.redirect('/')
        } else {
            next(new Error('you are not logged in'))
        }
    })


module.exports = userRouter