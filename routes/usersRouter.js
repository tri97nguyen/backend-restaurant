const express = require('express')
const userRouter = express.Router()
const User = require('../models/users')

userRouter.route('/')
    .get((req,res,next) => {
        User.find({})
            .then(users => res.send(users))
    })

userRouter.route('/signup')
    .post((req, res, next) => {
        const userName = req.body.username
        const password = req.body.password
        const isAdmin = req.body.isAdmin
        console.log(`username input: ${userName}\npassword input: ${password}\nisAdmin input: ${isAdmin}`)
        // if already login, then raise error
        if (req.session.user) {
            next(new Error('You are already login'))
            return
        } else { // if not, then create new account
            User.find({username: userName})
                .then(doc => {
                    if (doc.length !== 0) {
                        
                        
                        
                        next(new Error('username already existed'))
                        return
                    } else {
                        User.create({
                            username: userName,
                            password: password,
                            admin: isAdmin
                        }).then(newUser => {
                            res.send(newUser)
                        })
                        .catch(err => next(err))
                        
                    }
                })
        }
    })

userRouter.route('/login')
    .post((req, res, next) => {
        if (req.session.user) { // if client is logged in, then asked to logout first
            next('you are already logged in, please log out first')
            return
        } else { // if client is not logged in, then take login info
            const loginAuth = req.headers.authorization
            let userName = passWord = null
            
            if (!loginAuth) {
                next(new Error('enter username and password to login'))
            } else {
                [userName, passWord] = new Buffer.from(loginAuth.split(' ')[1], 'base64').toString().split(':')
            }
            User.findOne({username: userName, password: passWord})
                .then(doc => {
                    if (doc) {
                        console.log(`user object is ${JSON.stringify(doc)}`)
                        req.session.user = doc.username
                        res.send('You have successfully logged in')

                    } else {
                        console.log(`user object is ${JSON.stringify(doc)}`)
                        next(new Error('Username or Password incorrect'))
                    }
                })
                .catch(err => next(err))

        }
    })

userRouter.route('/logout')
    .get((req, res, next) => {
        if (req.session.user) {
            req.session.destroy()
            res.clearCookie("lalaland")
            res.redirect('/')
        } else {
            next(new Error('you are not logged in'))
        }
    })


module.exports = userRouter