const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const User = require('../models/users')
const auth = require('../middlewares/auth')


// only admin is authorized to view users
userRouter.route('/')
    .get(passport.authenticate('jwt', {session: false, failureRedirect: '/failure'}), auth.verifyAdmin, (req,res,next) => {
        User.find({})
            .then(users => res.status(200).json(users))
    })

userRouter.route('/signup')
    .post((req, res, next) => {
        const username = req.body.username
        const password = req.body.password
        const admin = req.body.admin
        User.create({
            username,
            password,
            admin
        }).then(user => {
            res.status(200).json(user)
        }).catch(error => next(error))

    })

userRouter.post('/facebook-login', passport.authenticate('facebook-token', {session: false}) ,(req, res, next) => {
    // successfully logged in by OAuth
    // send jwt token
    if (req.user) {
        const token = auth.getToken({_id: req.user._id})
        res.status(200).json({
            status: "success",
            token
        })
    } else {
        return next(new Error('something went wrong'))
    }
})

userRouter.route('/login')
    .post((req, res ,next) => {
        const username = req.body.username
        const password = req.body.password
        User.findOne({username, password}).exec()
            .then(user => {
                console.log('omg exec actually returned a promise!')
                // correct username and password
                // now send token for jwt authentication
                if (user) {
                    console.log(`login user is ${JSON.stringify(user)}`)
                    const token = auth.getToken({_id: user._id})
                    res.status(200).json({
                        status: "success",
                        token
                    })
                } else {
                    next(new Error('login failed'))
                }
            })
            .catch(error => next(error))
            
    })

    /**
     * to be implemented:
     * todo: look up how to send request to detroy jwt token from server to client
    */
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