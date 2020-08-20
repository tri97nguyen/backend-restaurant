const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/users')

// passport.use(new LocalStrategy((username, password, done) => {
//     User.findOne({username: username})
//         .then(user => {
//             // if user is null, then wrong username, then reject
//             if (!user) {
//                 done(null, false, {message: 'incorrect username'})
//             } else if (user.password !== password) {
//                 done(null, false, {message: 'incorrect password'})
//             } else {
//                 done(null, user)
//             }
//             // if user is available but password is incorrect, then reject
            
//             // else correct username and password, then authenticate successful
//         })
//         .catch(err => done(err))
// }))

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
