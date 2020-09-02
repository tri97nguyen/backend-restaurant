const User = require("../models/users")
const jwt = require('jsonwebtoken')
const passport = require('passport')
const secret = "keyboard cat"
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const FacebookTokenStrategy = require('passport-facebook-token')

// JWT
const opts = {
    secretOrKey: "keyboard cat",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(new JwtStrategy(opts, (payload, done) => {
    User.findOne({_id : payload._id})
        .then(user => {
            if (!user) {
                console.log('jwt failed: wrong token')
                return done(null, false)
            }
            else {
                console.log('jwt authenticated successfully')
                return done(null, user)
            }
        })
        .catch(error => {
            console.log('jwt failed: an error occurred')
            done(error)
        })
})) 


exports.verifyAdmin = (req, res, next) => {
    // if user is admin, then allow the route to pass through
    if (req.user.admin) {
        next()
        return
    }
    else {
        next(new Error("you don't have admin priviledge"))
        return
    }
}

// send token when user successfully login first time.
// later attempts to access protected route are authenticated by token sent from client
// token will be validated via authenticate() method below
exports.getToken = (user) => {
    return jwt.sign(user, secret, {expiresIn: 3000} )
}

exports.jwtAuthenticate = passport.authenticate('jwt', {session: false, failureRedirect: "/failure"})


// Facebook OAuth 2
passport.use(new FacebookTokenStrategy({
    clientID: '2712272982352182',
    clientSecret: '33a6288be15c423034b5247fa3b54a09'
}, (accessToken, refeshToken, profile, done) => {
    User.findOne({facebookId: profile.id})
        .then(user => {
            console.log(`user is ${JSON.stringify(user)}`)
            if (user) {
                
                // if user already exist in db
                done(null, user)
            } else {
                // create first time user
                const newUser = new User({firstname: profile.name.givenName, lastname: profile.name.familyName})
                newUser.facebookId = profile.id
                newUser.save().then(savedUser => {
                    done(null, savedUser)
                })
                .catch(error => done(error))
            }
        })
        .catch(error => done(error))
}))